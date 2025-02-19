import { API_PATHS } from '@/constants';
import {
  Bookmark,
  BookmarkDto,
  BookmarkItem,
  BookmarkParam,
  CalculateBookmarkBySubjectIdRequest,
  CalculateBookmarkRequest,
  CalculatedSubjectDto,
  Response,
} from '@/Interfaces';

export const fetchBookmark = async (
  params: BookmarkParam,
): Promise<Response<Bookmark[]>> => {
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

export const addBookmarkApi = async (
  params: BookmarkItem,
): Promise<Response<any>> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.bookmark}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(params),
    },
  );

  return res.json();
};

export const deleteBookmarkApi = async (
  params: BookmarkItem,
): Promise<Response<any>> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.bookmark}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(params),
    },
  );

  return res.json();
};

export const updateBookmarkApi = async (
  params: BookmarkItem,
): Promise<Response<any>> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.bookmark}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(params),
    },
  );

  return res.json();
};

export const fetchBookmarkDetail = async (
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
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.bookmarkDetail}?${queryParams}`,
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

export const addMultipleBookmarkApi = async (
  params: BookmarkItem[],
): Promise<Response<BookmarkDto[]>> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.bookmark}/bulk`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(params),
    },
  );
  return res.json();
};

export const calculateBookmark = async (
  params: CalculateBookmarkRequest,
): Promise<Response<CalculatedSubjectDto>> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.bookmark}/calculate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(params),
    },
  );

  return res.json();
};

export const calculateBookmarkBySubject = async (
  params: CalculateBookmarkBySubjectIdRequest,
): Promise<Response<CalculatedSubjectDto>> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.bookmark}/calculate/subject`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(params),
    },
  );

  return res.json();
};
