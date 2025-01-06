import { access } from 'fs';

export const API_PATHS = {
  accessToken: '/auth/accessToken',
  bookmark: '/bookmark',
  subject: '/subjects',
  subjectByIds: '/subjects/by-ids',
  faculty: '/faculty',
  googleAuth: '/auth/google',
  googleAuthCallback: '/auth/google/callback',
};

export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
};
