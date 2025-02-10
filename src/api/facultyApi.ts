import { API_PATHS } from '@/constants';
import { FacultyDto, Response } from '@/Interfaces';

export const fetchListFaculty = async (): Promise<Response<FacultyDto[]>> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.faculty}`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return res.json();
};
