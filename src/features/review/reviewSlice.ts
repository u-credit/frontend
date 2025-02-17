//frontend/src/features/review/reviewSlice.ts
import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction,
} from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { Review, ReviewState } from '@/Interfaces/review.interface';

export const toggleReviewLike = createAsyncThunk(
  'review/toggleLike',
  async (reviewId: string) => {
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

    if (!response.ok) {
      throw new Error('Failed to toggle like');
    }

    const { data } = await response.json();
    return { ...data, reviewId };
  },
);

const initialState: ReviewState = {
  reviews: {},
  likedReviews: {},
  loading: false,
  error: null,
  averageRating: 0,
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    setInitialReviews(state, action: PayloadAction<Review[]>) {
      state.reviews = {};
      if (Array.isArray(action.payload)) {
        const ownReviews: Review[] = [];
        const otherReviews: Review[] = [];

        action.payload.forEach((review) => {
          if (review.isOwner) {
            ownReviews.push(review);
          } else {
            otherReviews.push(review);
          }
        });

        const sortByDate = (a: Review, b: Review) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

        const sortedReviews = [
          ...ownReviews.sort(sortByDate),
          ...otherReviews.sort(sortByDate),
        ];

        sortedReviews.forEach((review) => {
          if (review?.review_id) {
            state.reviews[review.review_id] = {
              ...review,
              isOwner: Boolean(review.isOwner),
            };
          }
        });
      }
    },
    setAverageRating(state, action: PayloadAction<number>) {
      state.averageRating = action.payload || 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleReviewLike.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleReviewLike.fulfilled, (state, action) => {
        const { reviewId, isLikedByCurrentUser, likeCount, likedBy } =
          action.payload;
        if (state.reviews[reviewId]) {
          state.reviews[reviewId] = {
            ...state.reviews[reviewId],
            isLikedByCurrentUser,
            likeCount,
            likedBy,
          };
          state.likedReviews[reviewId] = isLikedByCurrentUser;
        }
        state.loading = false;
      })
      .addCase(toggleReviewLike.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to toggle like';
      });
  },
});

// Selectors
const selectReviewState = (state: RootState) => state.review;

export const selectAllReviews = createSelector(
  [selectReviewState],
  (reviewState) => Object.values(reviewState.reviews),
);

export const selectIsReviewLiked = createSelector(
  [selectReviewState, (_state: RootState, reviewId: string) => reviewId],
  (reviewState, reviewId) => reviewState.likedReviews[reviewId] ?? false,
);

export const selectReviewLikeCount = createSelector(
  [selectReviewState, (_state: RootState, reviewId: string) => reviewId],
  (reviewState, reviewId) => reviewState.reviews[reviewId]?.likeCount ?? 0,
);

export const selectReviewLoading = createSelector(
  [selectReviewState],
  (reviewState) => reviewState.loading,
);

export const { setInitialReviews, setAverageRating } = reviewSlice.actions;

export default reviewSlice.reducer;
