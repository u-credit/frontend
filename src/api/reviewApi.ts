import { API_PATHS } from '@/constants';
import {
  Review,
  CreateReviewDto,
  ReviewResponse,
  TeachingOptionsResponse,
} from '@/Interfaces/review.interface';
import { Response } from '@/Interfaces';

export const createReview = async (
  data: CreateReviewDto,
): Promise<Response<Review>> => {
  const accessToken = localStorage.getItem('access_token');

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.reviews}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
      body: JSON.stringify(data),
    },
  );
  return res.json();
};

export const getReviews = async (
  subjectId: string,
): Promise<Response<ReviewResponse>> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.reviews}?subjectId=${subjectId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    );

    const data = await res.json();
    return {
      ...data,
      data: {
        reviews: data.data.reviews,
        averageRating: Number(data.data.averageRating) || 0,
      },
    };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return {
      status: false,
      statusCode: 500,
      message: 'Failed to fetch reviews',
      data: {
        reviews: [],
        averageRating: 0,
      },
    };
  }
};

export const getTeachingOptions = async (
  subjectId: string,
): Promise<Response<TeachingOptionsResponse>> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.reviewOptions}?subjectId=${subjectId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    );
    const data = await res.json();
    return {
      ...data,
      data: {
        years: data.data.years || [],
        semesters: data.data.semesters || [],
        teachers: data.data.teachers || [],
      },
    };
  } catch (error) {
    console.error('Error fetching teaching options:', error);
    return {
      status: false,
      statusCode: 500,
      message: 'Failed to fetch teaching options',
      data: {
        years: [],
        semesters: [],
        teachers: [],
      },
    };
  }
};
