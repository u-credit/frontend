import { API_PATHS } from '@/constants';

export const fetchUserRoles = async (userId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.roles}/user/${userId}`,
      {
        method: 'GET',
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

export const assignRole = async (userId: string, roleId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.roles}/user/${userId}/role/${roleId}`,
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

export const removeRole = async (userId: string, roleId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.roles}/user/${userId}/role/${roleId}`,
      {
        method: 'DELETE',
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