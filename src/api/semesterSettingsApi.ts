import { API_PATHS } from '@/constants';

export interface SemesterSetting {
  id: number;
  semester: number;
  year: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const fetchSemesterSettings = async (): Promise<SemesterSetting[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.semesterSettings}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return res.json();
};

export const fetchActiveSemesterSetting =
  async (): Promise<SemesterSetting> => {
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
      return { semester: 1, year: 2566 };
    }
  };

export const createSemesterSetting = async (data: {
  semester: number;
  year: number;
}): Promise<SemesterSetting> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.semesterSettings}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  );
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
    },
  );
  return res.json();
};
