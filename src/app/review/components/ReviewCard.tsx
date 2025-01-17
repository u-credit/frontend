import React, { useState } from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

interface ReviewCardProps {
  rating: number;
  year: number;
  semester: number;
  teacherName: string;
  reviewText: string;
  date: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  rating,
  year,
  semester,
  teacherName,
  reviewText,
  date,
}) => {
  const [likeCount, setLikeCount] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('th-TH', options);
  };

  const formatAcademicYear = (year: number, semester: number) => {
    return `${semester}/${year}`;
  };

  const formattedRating = Math.max(0, Math.min(5, rating));

  return (
    <div className="mb-4 rounded-md overflow-hidden border border-gray-200">
      <div className="bg-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm">
              ปีการศึกษา : {formatAcademicYear(year, semester)}
            </span>
            <span className="text-sm ml-5">ผู้สอน : {teacherName}</span>
          </div>
          <div className="flex items-center text-lg">
            <span className="text-primary-400">
              {'★'.repeat(formattedRating)}
            </span>
            <span className="text-gray-500">
              {'☆'.repeat(5 - formattedRating)}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-white p-5">
        <p className="text-sm mb-2">{reviewText}</p>
        <div className="flex justify-start items-center text-xs text-gray-500">
          <button
            className={`flex items-center ${isLiked ? 'text-primary-400' : 'text-gray-500'}`}
            onClick={handleLikeClick}
          >
            <ThumbUpIcon sx={{ marginRight: '4px', fontSize: '16px' }} />{' '}
            มีประโยชน์
          </button>
          <span className="ml-2">({likeCount})</span>
          <span className="ml-auto">{formatDate(date)}</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
