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
  UpdateRecalculateBookmarkDto,
} from '@/Interfaces';
import { buildQueryParams } from '@/utils';

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
  try {
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
  } catch (e) {
    return {
      status: false,
      data: null,
    };
  }
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

export const calculateOriginalSchedule = async (): Promise<
  Response<CalculatedSubjectDto>
> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.bookmark}/calculate?isShow=1`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    );

    return res.json();
  } catch (e) {
    return {
      status: false,
      data: {
        groups: [],
        matched: [],
        unmatched: [],
        custom: [],
      },
    };
  }
};

export const calculateBookmark = async (
  params: CalculateBookmarkRequest,
): Promise<Response<CalculatedSubjectDto>> => {
  const queryParams = buildQueryParams(params);
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.bookmark}/calculate/update?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    );

    return res.json();
  } catch (e) {
    return {
      status: false,
      data: {
        groups: [],
        matched: [],
        unmatched: [],
        custom: [],
      },
    };
  }
};

export const calculateBookmarkBySubject = async (
  params: CalculateBookmarkBySubjectIdRequest,
): Promise<Response<CalculatedSubjectDto>> => {
  const queryParams = buildQueryParams(params);
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.bookmark}/calculate/update/by-subject/${params.subjectId}?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    );

    return res.json();
  } catch (e) {
    return {
      status: false,
      data: {
        groups: [],
        matched: [],
        unmatched: [],
        custom: [],
      },
    };
  }
};

export const updateAndRecalculateBookmark = async (
  params: UpdateRecalculateBookmarkDto,
): Promise<Response<CalculatedSubjectDto>> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.bookmark}/update/recalculate`,
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
  } catch (e) {
    return {
      status: false,
      data: {
        groups: [],
        matched: [],
        unmatched: [],
        custom: [],
      },
    };
  }
};
