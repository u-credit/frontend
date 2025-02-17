import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { login, refreshAccessToken } from '@/features/auth/authSlice';
import { AppDispatch } from '@/features/store';
import { fetchAccessToken } from '@/api/authApi';
import { handleLogout } from '@/features/auth/authAction';
import { useBookmark } from './useBookmark';
import useFaculty from './useFaculty';
import useTranscript from './useTranscript';
import {
  setCurriculumId,
  setCurriculumYear,
  setDepartmentId,
  setFacultyId,
} from '@/features/selectorValueSlice';
import { clearUserCurriGroup } from '@/features/facultySlice';

export const useAuth = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, sessionDuration } = useSelector(
    (state: {
      auth: {
        accessToken: string;
        isAuthenticated: boolean;
        sessionDuration: number;
      };
    }) => state.auth,
  );

  useBookmark();
  useFaculty();
  useTranscript();

  useEffect(() => {
    const fetchToken = async () => {
      const data = await fetchAccessToken();
      if (data.access_token) {
        dispatch(setFacultyId(data.user.faculty_id));
        dispatch(setDepartmentId(data.user.department_id));
        dispatch(setCurriculumId(data.user.curr2_id));
        dispatch(setCurriculumYear(data.user.curriculum_year));
        dispatch(login(data));
      } else {
        dispatch(handleLogout());
        dispatch(clearUserCurriGroup());
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
