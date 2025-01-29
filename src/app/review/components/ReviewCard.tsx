import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import { setInitialReviews } from '@/features/review/reviewSlice';
import type { AppDispatch } from '@/features/store';
import AuthModal from './AuthModal';
import { getReviews } from '@/api/reviewApi';
import { API_PATHS } from '@/constants';
import { ReviewCardProps } from '@/Interfaces/review.interface';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const ReviewCard: React.FC<ReviewCardProps> = ({
  reviewId,
  subjectId,
  rating,
  year,
  semester,
  teacherName,
  reviewText,
  createdAt,
  isLikedByCurrentUser,
  likeCount,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [modalOpen, setModalOpen] = useState(false);

  const handleLikeClick = async () => {
    if (!isAuthenticated) {
      setModalOpen(true);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.reviews}/${reviewId}/like`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
      );

      const data = await response.json();
      if (data.status) {
        const updatedReviews = await getReviews(subjectId);
        if (updatedReviews.status) {
          dispatch(setInitialReviews(updatedReviews.data.reviews));
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleModalClose = () => setModalOpen(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date
      .toLocaleString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Bangkok',
      })
      .replace(',', '');
  };

  const formatAcademicYear = (year: number, semester: number) => {
    return `${semester}/${year}`;
  };

  return (
    <>
      <div
        id={`review-card-${reviewId}`}
        className="mb-4 rounded-md overflow-hidden border border-gray-200"
      >
        <div className="bg-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <span id={`academic-year-${reviewId}`} className="text-sm mr-5">
                ปีการศึกษา : {formatAcademicYear(year, semester)}
              </span>
              <span
                id={`teacher-name-${reviewId}`}
                className="text-sm block sm:inline-block"
              >
                ผู้สอน : <br className="inline sm:hidden" />
                {teacherName}
              </span>
            </div>
            <div
              id={`rating-${reviewId}`}
              className="flex items-center text-lg"
            >
              <span className="hidden md:flex">
                {[...Array(5)].map((_, index) =>
                  index < rating ? (
                    <StarIcon key={index} className="text-primary-400" />
                  ) : (
                    <StarBorderIcon key={index} className="text-gray-500" />
                  ),
                )}
              </span>
              <span className="md:hidden flex items-center">
                <StarIcon className="text-primary-400 mr-1" />
                <span className="text-lg font-rubik">{rating}</span>
                <span className="text-xs text-gray-500 ml-1 mt-1 hidden sm:inline md:hidden">
                  จาก 5
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white p-5">
          <p id={`review-text-${reviewId}`} className="text-sm mb-2">
            {reviewText}
          </p>
          <div className="flex justify-start items-center text-xs text-gray-500">
            <div
              className={`flex justify-start items-center text-xs ${
                !isAuthenticated || !isLikedByCurrentUser
                  ? 'text-gray-500'
                  : 'text-primary-400'
              }`}
            >
              <button
                id={`like-button-${reviewId}`}
                className="flex items-center"
                onClick={handleLikeClick}
              >
                <ThumbUpIcon
                  className={`mr-1 ${
                    !isAuthenticated || !isLikedByCurrentUser
                      ? 'text-inherit'
                      : 'text-primary-400'
                  }`}
                  sx={{ fontSize: '16px' }}
                />
                <span>มีประโยชน์</span>
                <span id={`like-count-${reviewId}`} className="ml-2">
                  ({likeCount})
                </span>
              </button>
            </div>
            <span id={`created-date-${reviewId}`} className="ml-auto">
              {formatDate(createdAt)}
            </span>
          </div>
        </div>
      </div>

      <AuthModal open={modalOpen} onClose={handleModalClose} />
    </>
  );
};
export default ReviewCard;
