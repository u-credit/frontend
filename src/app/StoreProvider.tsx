'use client';
import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '../features/store';
import { fetchFaculty } from '@/features/facultySlice';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    if (storeRef.current) {
      storeRef.current.dispatch(fetchFaculty());
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
