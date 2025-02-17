import { use } from 'react';

export const API_PATHS = {
  accessToken: '/auth/accessToken',
  bookmark: '/bookmark',
  bookmarkDetail: '/bookmark/detail',
  subject: '/subjects',
  subjectByIds: '/subjects/by-ids',
  faculty: '/faculty',
  googleAuth: '/auth/google',
  googleAuthCallback: '/auth/google/callback',
  logout: '/auth/logout',
  transcript: '/transcript',
  reviews: '/api/reviews',
  reviewOptions: '/api/reviews/options',
  semesterSettings: '/api/semester-settings',
  roles: '/roles',
  user: '/user',
};

export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
};
