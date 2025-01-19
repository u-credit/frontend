import { API_PATHS } from '@/constants';
export const fetchAccessToken = async () => {
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
    return res;
  } catch (e) {}
  return null;
};

export const fetchLogout = async () => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.logout}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
  } catch (e) {}
};
