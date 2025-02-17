'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectIsAdmin } from '@/features/auth/authSlice';
import { CircularProgress } from '@mui/material';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAdmin = useSelector(selectIsAdmin);

  useEffect(() => {
    if (isAdmin === false) {
      router.replace('/course');
    }
  }, [isAdmin, router]);

  if (isAdmin === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}