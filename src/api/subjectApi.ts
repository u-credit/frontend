import { API_PATHS } from '@/constants';
import {
  ListSubjectQueryParams,
  PageDto,
  Response,
  SubjectDto,
} from '@/Interfaces';

export const fetchListSubject = async (
  params: ListSubjectQueryParams,
): Promise<Response<SubjectDto[]>> => {
  const queryParams = new URLSearchParams();
  console.log('test:', process.env.NEXT_PUBLIC_BACKEND_URL);
  Object.keys(params).forEach((key) => {
    const value = params[key as keyof ListSubjectQueryParams];
    if (value !== undefined && value !== null) {
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
      },
    },
  );
  return res.json();
};
