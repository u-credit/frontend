import { fetchLogout } from '@/api/authApi';
import { logout } from './authSlice';
import { AppDispatch } from '../store';
import { showAlert } from '../alertSlice';

export const handleLogout = () => async (dispatch: AppDispatch) => {
  try {
    await fetchLogout();

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
