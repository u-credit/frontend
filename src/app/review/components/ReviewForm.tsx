//frontend/src/app/review/components/ReviewForm.tsx
import React from 'react';
import { Button, TextField, Rating, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SelectInput from './SelectInput';

interface ReviewFormProps {
  rating: number;
  selectedYear: string;
  selectedSemester: string;
  selectedTeacherName: string;
  reviewText: string;
  setRating: (rating: number) => void;
  setSelectedYear: (year: string) => void;
  setSelectedSemester: (semester: string) => void;
  setSelectedTeacherName: (name: string) => void;
  setReviewText: (text: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  yearOptions: string[];
  semesterOptions: string[];
  teacherOptions: string[];
  isSubmitting: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  onAuthModalOpen: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  rating,
  selectedYear,
  selectedSemester,
  selectedTeacherName,
  reviewText,
  setRating,
  setSelectedYear,
  setSelectedSemester,
  setSelectedTeacherName,
  setReviewText,
  handleSubmit,
  yearOptions,
  semesterOptions,
  teacherOptions,
  isSubmitting,
  isLoading,
  isAuthenticated,
}) => {
  if (isLoading) {
    return (
      <div
        id="review-form-loading"
        className="flex justify-center items-center p-8"
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <form id="review-form" onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="border border-[#e0e0e0] rounded-lg flex flex-col flex-1 overflow-hidden">
        <div className="p-4">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectInput
                value={selectedYear}
                onChange={setSelectedYear}
                options={yearOptions}
                label="ปีการศึกษา *"
                sx={{ width: '100%' }}
              />
              <SelectInput
                value={selectedSemester}
                onChange={setSelectedSemester}
                options={semesterOptions}
                label="ภาคการศึกษา *"
                sx={{ width: '100%' }}
              />
              <SelectInput
                value={selectedTeacherName}
                onChange={setSelectedTeacherName}
                options={teacherOptions}
                label="ผู้สอน *"
                sx={{ width: '100%' }}
              />
            </div>

            {selectedYear && selectedSemester && selectedTeacherName && (
              <div className="flex justify-center items-center py-2">
                <Rating
                  id="rating"
                  name="rating"
                  value={rating}
                  precision={1}
                  onChange={(_, newValue) => setRating(newValue || 0)}
                  sx={{
                    fontSize: '32px',
                    '& .MuiRating-icon': {
                      color: '#c4c4c4',
                    },
                    '& .MuiRating-iconFilled': {
                      color: 'primary.main',
                    },
                    '& .MuiRating-iconHover': {
                      color: 'primary.main',
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <TextField
          id="review-text"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="เขียนข้อความ"
          multiline
          rows={4}
          fullWidth
          sx={{
            flex: 1,
            '& .MuiOutlinedInput-root': {
              height: '100%',
              '& fieldset': {
                border: 'none',
              },
              '& textarea': {
                height: '100% !important',
                padding: '16px',
                marginTop: 0,
                borderTop: '1px solid #e0e0e0',
              },
            },
          }}
        />
      </div>
      
      <div className="flex justify-start mt-4">
        <Button
          id="submit-button"
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<SendIcon />}
          disabled={isSubmitting}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          ส่งความคิดเห็น
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;
