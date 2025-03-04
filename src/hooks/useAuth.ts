import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { AppDispatch } from '@/features/store';
import { handleTokenRefresh } from '@/features/auth/authAction';
import { useBookmark } from './useBookmark';
import useFaculty from './useFaculty';
import useTranscript from './useTranscript';

export const useAuth = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, tokenExpiration } = useSelector(
    (state: {
      auth: {
        isAuthenticated: boolean;
        tokenExpiration: number;
      };
    }) => state.auth,
  );

  useBookmark();
  useFaculty();
  useTranscript();

  useEffect(() => {
    dispatch(handleTokenRefresh());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && tokenExpiration) {
      const refreshTokenBeforeExpiration = () => {
        const timeUntilExpiration = tokenExpiration * 1000;

        if (timeUntilExpiration <= 0) {
          dispatch(handleTokenRefresh());
        } else {
          setTimeout(() => {
            dispatch(handleTokenRefresh());
            refreshTokenBeforeExpiration();
          }, timeUntilExpiration);
        }
      };

      refreshTokenBeforeExpiration();
    }
  }, [dispatch, isAuthenticated, tokenExpiration]);
};
