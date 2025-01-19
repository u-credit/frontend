import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/reviews';

export const fetchReviewsData = async (subjectId: string) => {
  const response = await axios.get(`${API_BASE_URL}/course/${subjectId}`);
  return response.data;
};
