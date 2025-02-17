import { API_PATHS } from '@/constants';
import {
  CreateTranscriptResponse,
  fetchTranscriptResponse,
  RequiredCreditDto,
  Response,
} from '@/Interfaces';

export const uploadTranscriptFindStudentInfo = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.transcript}/curriculum`,
      {
        method: 'POST',
        credentials: 'include',
        body: formData,
      },
    );

    const result = await response.json();
    return { success: true, data: result.data[0] };
  } catch (error) {
    console.error('File upload failed', error);
    return {
      success: false,
      error: error || 'An unknown error occurred',
    };
  }
};

export const fetchListCategory = async (params: Record<string, string>) => {
  const queryString = new URLSearchParams(
    params as Record<string, string>,
  ).toString();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.transcript}/requiredAllCredit?${queryString}`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return res.json();
};

export const calculateCredit = async (file: File, body: any) => {
  const formData = new FormData();
  formData.append('file', file);

  Object.keys(body).forEach((key) => {
    formData.append(key, body[key]);
  });

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.transcript}/calculate`,
      {
        method: 'POST',
        credentials: 'include',
        body: formData,
      },
    );

    const result = await res.json();

    return result;
  } catch (error) {
    console.error('File upload failed', error);
    return {
      success: false,
      error: error || 'An unknown error occurred',
    };
  }
};

export const fetchRequiredCredit = async (
  params: Record<string, string>,
): Promise<Response<RequiredCreditDto[]>> => {
  const queryString = new URLSearchParams(
    params as Record<string, string>,
  ).toString();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.transcript}/requiredCredit?${queryString}`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return res.json();
};

export const createTranscript = async (
  data: any,
): Promise<Response<CreateTranscriptResponse>> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.transcript}/create/transcript`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    },
  );

  return res.json();
};

export const fetchTranscript = async (): Promise<
  Response<fetchTranscriptResponse>
> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.transcript}`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    },
  );

  return res.json();
};

export const deleteTranscript = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.transcript}`,
    {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    },
  );
  return res;
};
