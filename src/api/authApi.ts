import { API_PATHS } from '@/constants';
import { FetchAccessTokenResponse } from '@/Interfaces';

export const fetchAccessToken = async (): Promise<FetchAccessTokenResponse> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    );
    return res.json();
  } catch (e) {}
  return {
    access_token: '',
    session_duration: 0,
    user: {
      id: '',
      username: '',
      email: '',
      roles: '',
      faculty_id: '',
      department_id: '',
      curr2_id: '',
      curri_id: '',
      curriculum_year: '',
    },
  };
};

export const fetchLogout = async (): Promise<any> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.logout}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    );
    return response;
  } catch (e) {
    return;
  }
};
