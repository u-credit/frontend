import { API_PATHS } from '@/constants';

export const uploadTranscriptFindStudentInfo = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.transcript}/curriculum`,
      {
        method: 'POST',
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
