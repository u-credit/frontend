import { API_PATHS } from '@/constants';
import {
<<<<<<< HEAD
  ListSubjectQueryParams,
  PageDto,
=======
  ListSubjectByIdsQueryParams,
  ListSubjectQueryParams,
>>>>>>> 627568dbfc261d653c9b1935f2f78ff4d0ab664a
  Response,
  SubjectDto,
} from '@/Interfaces';

export const fetchListSubject = async (
  params: ListSubjectQueryParams,
  signal?: AbortSignal,
): Promise<Response<SubjectDto[]>> => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    const value = params[key as keyof ListSubjectQueryParams];
    if (value !== undefined && value !== null) {
<<<<<<< HEAD
      queryParams.append(key, value.toString());
    }
  });
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.subject}?${queryParams.toString()}`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
=======
      if (Array.isArray(value)) {
        value.forEach((item) => queryParams.append(key, item.toString()));
      } else {
        queryParams.append(key, value.toString());
      }
    }
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.subject}?${queryParams}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal,
    },
  );
  return res.json();
};

export const fetchListSubjectByIds = async (
  params: ListSubjectByIdsQueryParams,
): Promise<Response<SubjectDto[]>> => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    const value = params[key as keyof ListSubjectByIdsQueryParams];
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item) => queryParams.append(key, item.toString()));
      } else {
        queryParams.append(key, value.toString());
      }
    }
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.subjectByIds}?${queryParams}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
>>>>>>> 627568dbfc261d653c9b1935f2f78ff4d0ab664a
      },
    },
  );
  return res.json();
};
