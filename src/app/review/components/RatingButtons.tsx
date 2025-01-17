import React from 'react';
import { Button, ButtonGroup, styled } from '@mui/material';

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  '& .MuiButtonGroup-grouped': {
    border: 'none',
    '&:not(:last-of-type)': {
      borderRight: 'none',
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: '24px 32px',
  marginTop: '16px',
  borderBottom: '2px solid transparent',
  borderRadius: 0,
  color: 'black',
  '&.active': {
    borderBottom: `2px solid #E35205`,
    color: '#E35205',
  },
  '&:hover': {
    backgroundColor: 'transparent',
  },
}));

interface RatingFilterButtonsProps {
  selectedRating: number | null;
  setSelectedRating: (rating: number | null) => void;
}

const RatingFilterButtons: React.FC<RatingFilterButtonsProps> = ({
  selectedRating,
  setSelectedRating,
}) => {
  return (
    <StyledButtonGroup variant="text" aria-label="rating filter button group">
      <StyledButton
        onClick={() => setSelectedRating(null)}
        className={selectedRating === null ? 'active' : ''}
      >
        ทั้งหมด
      </StyledButton>
      {[5, 4, 3, 2, 1].map((rating) => (
        <StyledButton
          key={rating}
          onClick={() => setSelectedRating(rating)}
          className={selectedRating === rating ? 'active' : ''}
        >
          {rating} ดาว
        </StyledButton>
      ))}
    </StyledButtonGroup>
  );
};

export default RatingFilterButtons;