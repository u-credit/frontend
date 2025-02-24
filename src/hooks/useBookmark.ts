import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadBackup,
  loadBookmarks,
  loadBookmarksApi,
} from '@/features/bookmark/bookmarkSlice';
import { RootState, AppDispatch } from '@/features/store';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import { useSearchParams } from 'next/navigation';

export const useBookmark = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { semester, year, facultyId, departmentId, curriculumYear } =
    useSelector((state: RootState) => state.selectorValue);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (isAuthenticated) {
        const login = searchParams.get('login');
        if (login) {
          dispatch(loadBackup());
        }
        dispatch(loadBookmarksApi());
      } else {
        dispatch(loadBookmarks());
      }
    };
    fetchBookmarks();
  }, [
    dispatch,
    semester,
    year,
    isAuthenticated,
    facultyId,
    departmentId,
    curriculumYear,
  ]);
};
