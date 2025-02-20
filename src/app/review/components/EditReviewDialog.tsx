// src/app/review/components/EditReviewDialog.tsx
import React, { useState, useEffect } from 'react';
import { Dialog } from '@mui/material';
import { useDispatch } from 'react-redux';
import { showAlert } from '@/features/alertSlice';
import ReviewForm from './ReviewForm';
import { getTeachingOptions } from '@/api/reviewApi';
import { profanityFilter } from '@/utils/profanityFilter';

interface EditReviewDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData: {
    rating: number;
    year: number;
    semester: number;
    teacherName: string;
    reviewText: string;
  };
  subjectId: string;
}

const EditReviewDialog: React.FC<EditReviewDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  subjectId,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [yearOptions, setYearOptions] = useState<string[]>([]);
  const [semesterOptions, setSemesterOptions] = useState<string[]>([]);
  const [teacherOptions, setTeacherOptions] = useState<string[]>([]);

  const [rating, setRating] = useState(initialData.rating);
  const [selectedYear, setSelectedYear] = useState(initialData.year.toString());
  const [selectedSemester, setSelectedSemester] = useState(
    initialData.semester.toString(),
  );
  const [selectedTeacherName, setSelectedTeacherName] = useState(
    initialData.teacherName,
  );
  const [reviewText, setReviewText] = useState(initialData.reviewText);

  useEffect(() => {
    if (open) {
      const fetchOptions = async () => {
        setLoading(true);
        try {
          const response = await getTeachingOptions(subjectId);
          if (response.data) {
            setYearOptions(response.data.years.map(String));
            setSemesterOptions(response.data.semesters.map(String));
            setTeacherOptions(response.data.teachers.map((t) => t.name));
          }
        } catch (error) {
          console.error('Error fetching teaching options:', error);
        }
        setLoading(false);
      };

      fetchOptions();
      setRating(initialData.rating);
      setSelectedYear(initialData.year.toString());
      setSelectedSemester(initialData.semester.toString());
      setSelectedTeacherName(initialData.teacherName);
      setReviewText(initialData.reviewText);
    }
  }, [open, subjectId, initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const { isValid } = profanityFilter(reviewText);
    if (!isValid) {
      console.log('หยาบคาย');
      dispatch(
        showAlert({
          message: 'ไม่สามารถส่งความคิดเห็นได้ เนื่องจากมีคำไม่เหมาะสม',
          severity: 'error',
        }),
      );
      return;
    }

    try {
      await onSubmit({
        subjectId,
        rating,
        year: Number(selectedYear),
        semester: Number(selectedSemester),
        teacherName: selectedTeacherName,
        reviewText,
      });

      dispatch(
        showAlert({
          message: 'คุณแก้ไขรีวิวรายวิชานี้สำเร็จแล้ว',
          severity: 'success',
        }),
      );

      onClose();
    } catch (error) {
      dispatch(
        showAlert({
          message: 'เกิดข้อผิดพลาดในการแก้ไขรีวิว',
          severity: 'error',
        }),
      );
    }

    setSubmitting(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          padding: '24px',
          margin: '16px',
          maxHeight: 'calc(100% - 32px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      }}
    >
      <ReviewForm
        rating={rating}
        selectedYear={selectedYear}
        selectedSemester={selectedSemester}
        selectedTeacherName={selectedTeacherName}
        reviewText={reviewText}
        setRating={setRating}
        setSelectedYear={setSelectedYear}
        setSelectedSemester={setSelectedSemester}
        setSelectedTeacherName={setSelectedTeacherName}
        setReviewText={setReviewText}
        handleSubmit={handleSubmit}
        yearOptions={yearOptions}
        semesterOptions={semesterOptions}
        teacherOptions={teacherOptions}
        isSubmitting={submitting}
        isLoading={loading}
        isAuthenticated={true}
        onAuthModalOpen={() => {}}
      />
    </Dialog>
  );
};

export default EditReviewDialog;
