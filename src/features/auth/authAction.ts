import { fetchLogout } from '@/api/authApi';
import { logout, login, setRole } from './authSlice';
import { AppDispatch } from '../store';
import { showAlert } from '../alertSlice';
import { clearBookmark } from '../bookmark/bookmarkSlice';

export const handleLogout = () => async (dispatch: AppDispatch) => {
  try {
    await fetchLogout();
    dispatch(clearBookmark());
    dispatch(logout());
    dispatch(
      showAlert({ message: 'You have been logged out!', severity: 'success' }),
    );
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