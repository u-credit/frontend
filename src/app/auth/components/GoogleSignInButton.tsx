'use client';
import React from 'react';
import { API_PATHS } from '@/constants';
import GoogleIcon from '@/assets/google-icon-logo.svg';

export default function GoogleSignInButton() {
  const handleSignIn = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_PATHS.googleAuth}`;
  };

  return (
    <button
      onClick={handleSignIn}
      className="flex border-[1px] bg-white border-gray-300 rounded-full font-medium text-center items-center 
      justify-center gap-3 font-mitr w-60 h-8 hover:bg-gray-100 active:bg-gray-200"
    >
      <GoogleIcon className="h-5 w-5 my-auto" />
      เข้าสู่ระบบด้วย Google
    </button>
  );
}
