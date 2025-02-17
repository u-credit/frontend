import React, { useState, useEffect } from 'react';
import { Dialog } from '@mui/material';
import { useDispatch } from 'react-redux';
import { showAlert } from '@/features/alertSlice';
import ReviewForm from './ReviewForm';
import { getTeachingOptions } from '@/api/reviewApi';

interface CreateReviewDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  subjectId: string;
}

const CreateReviewDialog: React.FC<CreateReviewDialogProps> = ({
  open,
  onClose,
  onSubmit,
  subjectId,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [yearOptions, setYearOptions] = useState<string[]>([]);
  const [semesterOptions, setSemesterOptions] = useState<string[]>([]);
  const [teacherOptions, setTeacherOptions] = useState<string[]>([]);

  const [rating, setRating] = useState(0);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedTeacherName, setSelectedTeacherName] = useState('');
  const [reviewText, setReviewText] = useState('');

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
          dispatch(
            showAlert({
              message: 'เกิดข้อผิดพลาดในการโหลดข้อมูล',
              severity: 'error',
            }),
          );
        }
        setLoading(false);
      };

      fetchOptions();
      // Reset form when dialog opens
      setRating(0);
      setSelectedYear('');
      setSelectedSemester('');
      setSelectedTeacherName('');
      setReviewText('');
    }
  }, [open, subjectId, dispatch]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    if (!rating || !selectedYear || !selectedSemester || !selectedTeacherName || !reviewText.trim()) {
      dispatch(
        showAlert({
          message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
          severity: 'error',
        }),
      );
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit({
        rating,
        year: Number(selectedYear),
        semester: Number(selectedSemester),
        teacherName: selectedTeacherName,
        reviewText,
      });

      dispatch(
        showAlert({
          message: 'คุณเพิ่มรีวิวรายวิชานี้สำเร็จแล้ว',
          severity: 'success',
        }),
      );

      onClose();
    } catch (error) {
      dispatch(
        showAlert({
          message: 'เกิดข้อผิดพลาดในการเพิ่มรีวิว',
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
          overflow: 'hidden'
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

export default CreateReviewDialog;