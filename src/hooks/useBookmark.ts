import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadBookmarks,
  loadBookmarksApi,
} from '@/features/bookmark/bookmarkSlice';
import { RootState, AppDispatch } from '@/features/store';
import { selectIsAuthenticated } from '@/features/auth/authSlice';

export const useBookmark = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { semester, year, facultyId, departmentId, curriculumYear } =
    useSelector((state: RootState) => state.selectorValue);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) dispatch(loadBookmarksApi());
    else dispatch(loadBookmarks());
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
