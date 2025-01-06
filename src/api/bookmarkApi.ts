import { API_PATHS } from '@/constants';
import {
  BookmarkDto,
  BookmarkItem,
  BookmarkParam,
  Response,
} from '@/Interfaces';

export const fetchBookmark = async (
  params: BookmarkParam,
): Promise<Response<BookmarkDto[]>> => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    const value = params[key as keyof BookmarkItem];
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item) => queryParams.append(key, item.toString()));
      } else {
        queryParams.append(key, value.toString());
      }
    }
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.bookmark}?${queryParams}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    },
  );

  return res.json();
};
