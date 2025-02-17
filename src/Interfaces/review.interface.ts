//frontend/src/Interfaces/review.interface.ts
export interface Review {
  review_id: string;
  subjectId: string;
  userId: string;
  isOwner: boolean;
  rating: number;
  year: number;
  semester: number;
  teacherName: string;
  reviewText: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  status: string;
  likeCount: number;
  likedBy: string[];
  isLikedByCurrentUser?: boolean;
}

export interface ReviewState {
  reviews: { [reviewId: string]: Review };
  likedReviews: { [reviewId: string]: boolean };
  loading: boolean;
  error: string | null;
  averageRating: number;
}

export interface CreateReviewDto {
  subjectId: string;
  rating: number;
  year: number;
  semester: number;
  teacherName: string;
  reviewText: string;
}

export interface UpdateReviewDto {
  rating?: number;
  year?: number;
  semester?: number;
  teacherName?: string;
  reviewText?: string;
}

export interface ReviewResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: {
    reviews: Review[];
    averageRating: number;
  };
}

export interface ReviewCardProps {
  reviewId: string;
  subjectId: string;
  rating: number;
  year: number;
  semester: number;
  teacherName: string;
  reviewText: string;
  createdAt: string;
  likeCount: number;
  isLikedByCurrentUser: boolean;
  likedBy: string[];
}

export interface TeachingOptionsResponse {
  years: number[];
  semesters: number[];
  teachers: Array<{
    id: string;
    name: string;
  }>;
}

export interface AverageRatingDto {
  subjectId: string;
  averageRating: number;
}
