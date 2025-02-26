import { API_PATHS } from '@/constants';
import { Response } from '@/Interfaces';
export interface SemesterSetting {
  id: number;
  semester: number;
  year: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const fetchSemesterSettings = async (): Promise<
  Response<SemesterSetting[]>
> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.semesterSettings}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    },
  );

  if (!res.ok) throw new Error('Network response was not ok');

  return res.json();
};

export const fetchActiveSemesterSetting = async (): Promise<
  Response<SemesterSetting> | { data: { semester: number; year: number } }
> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.semesterSettings}/active`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return {
      data: {
        semester: 2,
        year: 2567,
      },
    };
  }
};

export const createSemesterSetting = async (data: {
  semester: number;
  year: number;
}): Promise<Response<SemesterSetting>> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.semesterSettings}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    },
  );
  
  if (!res.ok) throw new Error('Failed to add setting');

  return res.json();
};

export const activateSemesterSetting = async (
  id: number,
): Promise<SemesterSetting> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.semesterSettings}/${id}/activate`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    },
  );
  return res.json();
};
