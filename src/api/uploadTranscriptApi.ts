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
    return { success: true, data: result.data.curriculum[0] };
  } catch (error) {
    console.error('File upload failed', error);
    return {
      success: false,
      error: error || 'An unknown error occurred',
    };
  }
};
