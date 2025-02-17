import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

interface RatingButtonsProps {
  selectedRating: number | null;
  setSelectedRating: (rating: number | null) => void;
  reviews: Array<{
    rating: number;
    review_id: string;
    year: string;
    semester: string;
    teacherName: string;
    reviewText: string;
    createdAt: string;
    isOwner?: boolean;
  }>;
}

const RatingButtons: React.FC<RatingButtonsProps> = ({
  selectedRating,
  setSelectedRating,
  reviews,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const otherReviews = reviews.filter(review => !review.isOwner);

  const getRatingCount = (rating: number | null) => {
    if (rating === null) {
      return otherReviews.length;
    }
    return otherReviews.filter((review) => review.rating === rating).length;
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectRating = (rating: number) => {
    setSelectedRating(rating);
    handleClose();
  };

  const getStarIcons = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) =>
          index < rating ? (
            <StarIcon key={index} className="text-primary-400 text-xl" />
          ) : (
            <StarBorderIcon key={index} className="text-primary-400 text-xl" />
          ),
        )}
      </div>
    );
  };

  const getDisplayText = () => {
    if (selectedRating === null) {
      return (
        <div className="flex items-center">
          <span className="mr-2">ดาว</span>
          <StarIcon className="text-primary-400 text-xl" />
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        {getStarIcons(selectedRating)}
        <span>({getRatingCount(selectedRating)})</span>
      </div>
    );
  };

  const baseButtonStyles = `
    flex items-center justify-center h-16 px-7 font-bai font-semibold 
    border-y-[3px] border-transparent relative transition-colors duration-200
  `;

  const selectedStyles = `border-b-primary-400 text-primary-400`;
  const hoverStyles = `hover:border-b-primary-400 hover:text-primary-400`;
  const dividerStyles = `after:content-[''] after:absolute after:right-0 after:h-6 after:w-[1px]`;

  return (
    <div id="rating-filter" className="flex items-stretch h-16">
      <button
        id="all-ratings-btn"
        onClick={() => setSelectedRating(null)}
        className={`${baseButtonStyles}
          ${selectedRating === null ? selectedStyles : hoverStyles}
          ${dividerStyles}`}
      >
        <span>ทั้งหมด</span>
        <span className="ml-1">({getRatingCount(null)})</span>
      </button>

      <div id="desktop-rating-buttons" className="hidden lg:flex">
        {[5, 4, 3, 2, 1].map((rating, index) => (
          <button
            id={`rating-btn-${rating}`}
            key={rating}
            onClick={() => setSelectedRating(rating)}
            className={`${baseButtonStyles}
              ${selectedRating === rating ? selectedStyles : hoverStyles}
              ${index !== 4 ? dividerStyles : ''}`}
          >
            <span className="mr-1">{rating}</span>
            <span>ดาว</span>
            <span className="ml-1">({getRatingCount(rating)})</span>
          </button>
        ))}
      </div>

      <div id="mobile-rating-menu" className="lg:hidden">
        <Button
          id="mobile-rating-trigger"
          onClick={handleClick}
          endIcon={<KeyboardArrowDownIcon />}
          sx={{
            height: '64px',
            fontSize: '1rem',
            fontFamily: 'Bai Jamjuree',
            color: 'black',
            paddingX: '2rem',
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
        >
          {getDisplayText()}
        </Button>
        <Menu
          id="rating-dropdown"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {[5, 4, 3, 2, 1].map((rating) => (
            <MenuItem
              id={`rating-menu-item-${rating}`}
              key={rating}
              onClick={() => handleSelectRating(rating)}
              sx={{
                fontFamily: 'Bai Jamjuree',
                color: selectedRating === rating ? '#E35205' : 'inherit',
                minWidth: '200px',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              {getStarIcons(rating)}
              <span>({getRatingCount(rating)})</span>
            </MenuItem>
          ))}
        </Menu>
      </div>
    </div>
  );
};

export default RatingButtons;