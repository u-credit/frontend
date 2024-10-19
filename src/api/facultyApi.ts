import { API_PATHS } from '@/constants';
import { FacultyDto, PageDto, Response } from '@/Interfaces';

export const fetchListFaculty = async (): Promise<Response<FacultyDto[]>> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.faculty}`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    },
  );
  return res.json();
};
