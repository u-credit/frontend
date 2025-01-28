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
    <form id="review-form" onSubmit={handleSubmit}>
      <div className="border border-[#e0e0e0] rounded-lg">
        <div className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:grid md:grid-cols-2 lg:flex lg:flex-row lg:items-center gap-4 md:gap-3 lg:gap-4">
              <div className="flex flex-row gap-4 w-full md:contents lg:flex lg:w-auto">
                <div className="flex-1 md:w-full lg:w-[250px]">
                  <SelectInput
                    id="year-select"
                    value={selectedYear}
                    onChange={setSelectedYear}
                    options={yearOptions}
                    label="ปีการศึกษา *"
                    sx={{ width: '100%' }}
                  />
                </div>
                <div className="flex-1 md:w-full lg:w-[250px]">
                  <SelectInput
                    id="semester-select"
                    value={selectedSemester}
                    onChange={setSelectedSemester}
                    options={semesterOptions}
                    label="ภาคการศึกษา *"
                    sx={{ width: '100%' }}
                  />
                </div>
              </div>

              <div className="w-full md:col-span-2 lg:w-[250px]">
                <SelectInput
                  id="teacher-select"
                  value={selectedTeacherName}
                  onChange={setSelectedTeacherName}
                  options={teacherOptions}
                  label="ผู้สอน *"
                  sx={{ width: '100%' }}
                />
              </div>

              {selectedYear && selectedSemester && selectedTeacherName && (
                <div className="hidden lg:flex lg:flex-1">
                  <Rating
                    id="rating-desktop"
                    name="rating-desktop"
                    value={rating}
                    precision={1}
                    onChange={(_, newValue) => setRating(newValue || 0)}
                    style={{ fontSize: '30px' }}
                    sx={{
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

            {selectedYear && selectedSemester && selectedTeacherName && (
              <div className="flex lg:hidden justify-center">
                <Rating
                  id="rating-mobile"
                  name="rating-mobile"
                  value={rating}
                  precision={1}
                  onChange={(_, newValue) => setRating(newValue || 0)}
                  style={{ fontSize: '30px' }}
                  sx={{
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
          rows={3}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                border: 'none',
              },
              '& textarea': {
                padding: '16px 16px',
                marginTop: '-16px',
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
