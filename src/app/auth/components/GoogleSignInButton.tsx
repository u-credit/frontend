'use client';
import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '@/features/auth/authSlice';
import { API_PATHS } from '@/constants';

export default function GoogleSignInButton() {
  // const dispatch = useDispatch();

  const handleSignIn = () => {
    // dispatch(logout());
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.googleAuth}`;
  };

  return <button onClick={handleSignIn}>Sign in with Google</button>;
}
