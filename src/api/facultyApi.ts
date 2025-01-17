import { API_PATHS } from '@/constants';
<<<<<<< HEAD
import { FacultyDto, PageDto, Response } from '@/Interfaces';
=======
import { FacultyDto, Response } from '@/Interfaces';
>>>>>>> 627568dbfc261d653c9b1935f2f78ff4d0ab664a

export const fetchListFaculty = async (): Promise<Response<FacultyDto[]>> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.faculty}`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
<<<<<<< HEAD
        'Access-Control-Allow-Origin': '*',
=======
>>>>>>> 627568dbfc261d653c9b1935f2f78ff4d0ab664a
      },
    },
  );
  return res.json();
};
