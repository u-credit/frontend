import React from 'react';
import { Button, TextField, Rating } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SelectInput from './SelectInput';

interface ReviewFormProps {
  rating: number;
  selectedYear: string;
  selectedTeacherName: string;
  reviewText: string;
  setRating: (rating: number) => void;
  setSelectedYear: (year: string) => void;
  setSelectedTeacherName: (name: string) => void;
  setReviewText: (text: string) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  rating,
  selectedYear,
  selectedTeacherName,
  reviewText,
  setRating,
  setSelectedYear,
  setSelectedTeacherName,
  setReviewText,
  handleSubmit,
}) => {
  const yearOptions = [
    '',
    '2/2566',
    '1/2566',
    '2/2565',
    '1/2565',
    '2/2564',
    '1/2564',
  ];

  const teacherOptions = ['', 'ผศ. วินพงศ์ เกษมศิริ', 'กีตาร์'];

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            padding: '20px',
            gap: '8px',
          }}
        >
          <div style={{ flex: 1, maxWidth: '270px' }}>
            <SelectInput
              value={selectedYear || ''}
              onChange={setSelectedYear}
              options={yearOptions}
              label="ปีการศึกษา"
            />
          </div>
          <div
            style={{
              flex: 1,
              maxWidth: '270px',
              marginLeft: '12px',
              marginRight: '8px',
            }}
          >
            <SelectInput
              value={selectedTeacherName || ''}
              onChange={setSelectedTeacherName}
              options={teacherOptions}
              label="ผู้สอน"
            />
          </div>
          {selectedYear && selectedTeacherName && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                flexShrink: 0,
              }}
            >
              <Rating
                name="rating"
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
        <TextField
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          marginTop: '16px',
        }}
      >
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<SendIcon />}
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
