import { API_PATHS } from '@/constants';
import {
  ListSubjectByIdsQueryParams,
  ListSubjectQueryParams,
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
      },
    },
  );
  return res.json();
};
