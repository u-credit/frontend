import { fetchLogout, fetchAccessToken } from '@/api/authApi';
import { logout, login } from './authSlice';
import { AppDispatch } from '../store';
import { showAlert } from '../alertSlice';
import { clearBookmark } from '../bookmark/bookmarkSlice';
import {
  setCurriculumId,
  setCurriculumYear,
  setDepartmentId,
  setFacultyId,
} from '@/features/selectorValueSlice';
import { clearUserCurriGroup } from '@/features/facultySlice';

export const handleLogout = () => async (dispatch: AppDispatch) => {
  try {
    const response = await fetchLogout();

    if (response.ok) {
      dispatch(clearBookmark());

      dispatch(logout());

      dispatch(
        showAlert({
          message: 'You have been logged out!',
          severity: 'success',
        }),
      );
    }
  } catch (error) {
    console.error('Logout failed:', error);
    dispatch(
      showAlert({
        message: 'Logout failed. Please try again.',
        severity: 'error',
      }),
    );
  }
};

export const handleLogin = (data: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(login(data));
  } catch (error) {
    console.error('Login failed:', error);
    dispatch(
      showAlert({
        message: 'Login failed. Please try again.',
        severity: 'error',
      }),
    );
  }
};

export const handleTokenRefresh = () => async (dispatch: AppDispatch) => {
  try {
    const data = await fetchAccessToken();

    if (data?.access_token) {
      dispatch(login(data));

      if (data.user.faculty_id) dispatch(setFacultyId(data.user.faculty_id));
      if (data.user.department_id)
        dispatch(setDepartmentId(data.user.department_id));
      if (data.user.curr2_id) dispatch(setCurriculumId(data.user.curr2_id));
      if (data.user.curriculum_year)
        dispatch(setCurriculumYear(data.user.curriculum_year));
    } else {
      dispatch(handleLogout());
      dispatch(clearUserCurriGroup());
    }
  } catch (error) {
    dispatch(handleLogout());
    dispatch(clearUserCurriGroup());
  }
};
