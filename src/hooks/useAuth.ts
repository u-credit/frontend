import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { refreshAccessToken, logout, login } from '../features/auth/authSlice';
import { fetchAccessToken } from '@/api/authApi';
import { AppDispatch } from '@/features/store';
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
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(
        () => {
          dispatch<any>(refreshAccessToken());
        },
        sessionDuration - 60 * 1000, // รีเฟรชก่อนหมดเวลา 1 นาที
      );

      return () => clearTimeout(timer);
    }
  }, [dispatch, isAuthenticated, sessionDuration]);
};
