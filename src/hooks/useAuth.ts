import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { login, refreshAccessToken } from '@/features/auth/authSlice';
import { AppDispatch } from '@/features/store';
import { fetchAccessToken } from '@/api/authApi';
import { handleLogout } from '@/features/auth/authAction';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, sessionDuration } = useSelector(
    (state: {
      auth: {
        accessToken: string;
        isAuthenticated: boolean;
        sessionDuration: number;
      };
    }) => state.auth,
  );

  useEffect(() => {
    const fetchToken = async () => {
      const response = await fetchAccessToken();
      if (response) {
        const data = await response.json();
        dispatch(login(data));
      } else {
        dispatch(handleLogout());
      }
    };
    fetchToken();
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(
        () => {
          dispatch(refreshAccessToken());
        },
        sessionDuration - 60 * 1000,
      );

      return () => clearTimeout(timer);
    }
  }, [dispatch, isAuthenticated, sessionDuration]);
};
