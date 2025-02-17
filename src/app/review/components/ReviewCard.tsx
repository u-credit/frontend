// src/app/review/components/ReviewCard.tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import {
  setAverageRating,
  setInitialReviews,
} from '@/features/review/reviewSlice';
import { showAlert } from '@/features/alertSlice';
import type { AppDispatch } from '@/features/store';
import { getReviews, deleteReview } from '@/api/reviewApi';
import AuthModal from './AuthModal';
import EditReviewDialog from './EditReviewDialog';

interface ReviewCardProps {
  reviewId: string;
  subjectId: string;
  userId: string;
  rating: number;
  year: number;
  semester: number;
  teacherName: string;
  reviewText: string;
  createdAt: string;
  isLikedByCurrentUser: boolean;
  likeCount: number;
  isOwner?: boolean;
}

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
  isOwner,
  userId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleLikeClick = async () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/${reviewId}/like`,
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

  const handleEdit = () => {
    handleMenuClose();
    setEditDialogOpen(true);
  };

  const handleDelete = async () => {
    handleMenuClose();
    try {
      await deleteReview(reviewId);
      dispatch(
        showAlert({
          message: 'คุณได้ลบรีวิวรายวิชานี้แล้ว',
          severity: 'success',
        }),
      );
      const updatedReviews = await getReviews(subjectId);
      if (updatedReviews.status) {
        dispatch(setInitialReviews(updatedReviews.data.reviews));
      }
    } catch (error) {
      dispatch(
        showAlert({
          message: 'เกิดข้อผิดพลาดในการลบรีวิว',
          severity: 'error',
        }),
      );
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return new Date(date.getTime() + 7 * 60 * 60 * 1000)
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
      <div className="mb-4 rounded-md overflow-hidden border border-gray-200">
        <div className="bg-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm mr-5">
                ปีการศึกษา : {formatAcademicYear(year, semester)}
              </span>
              <span className="text-sm block sm:inline-block">
                ผู้สอน : <br className="inline sm:hidden" />
                {teacherName}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-lg">
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
              {isOwner && (
                <IconButton
                  onClick={handleMenuOpen}
                  size="small"
                  className="!bg-gray-300 hover:!bg-gray-400"
                  sx={{
                    padding: '8px',
                    '&:hover': {
                      backgroundColor: '#d1d5db',
                    },
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white p-5">
          <p className="text-sm mb-2">{reviewText}</p>
          <div className="flex justify-start items-center text-xs text-gray-500">
            <button
              className={`flex items-center transition-colors ${
                isLikedByCurrentUser
                  ? 'text-primary-400'
                  : 'text-gray-500 hover:text-primary-400'
              }`}
              onClick={handleLikeClick}
            >
              <ThumbUpIcon className="mr-1" sx={{ fontSize: '16px' }} />
              <span>มีประโยชน์</span>
              <span className="ml-2">({likeCount})</span>
            </button>
            <span className="ml-auto">{formatDate(createdAt)}</span>
          </div>
        </div>
      </div>

      <Menu
        id="review-menu"
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>แก้ไขรีวิว</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" className="text-red-500" />
          </ListItemIcon>
          <ListItemText className="text-red-500">ลบรีวิว</ListItemText>
        </MenuItem>
      </Menu>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      <EditReviewDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSubmit={async (data) => {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reviews/${reviewId}`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
              },
            );

            if (response.ok) {
              const updatedReviews = await getReviews(subjectId);
              if (updatedReviews.status) {
                dispatch(setInitialReviews(updatedReviews.data.reviews));
                dispatch(setAverageRating(updatedReviews.data.averageRating));
              }
              dispatch(
                showAlert({
                  message: 'คุณแก้ไขรีวิวรายวิชานี้สำเร็จแล้ว',
                  severity: 'success',
                }),
              );
              setEditDialogOpen(false);
            }
          } catch (error) {
            dispatch(
              showAlert({
                message: 'เกิดข้อผิดพลาดในการแก้ไขรีวิว',
                severity: 'error',
              }),
            );
          }
        }}
        initialData={{
          rating,
          year,
          semester,
          teacherName,
          reviewText,
        }}
        subjectId={subjectId}
      />
    </>
  );
};
export default ReviewCard;
