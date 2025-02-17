import { selectIsAuthenticated } from '@/features/auth/authSlice';
import { AppDispatch } from '@/features/store';
import {
  fetchTranscriptSubject,
  setTranscriptData,
  setCurrentPage,
  setInitialPage,
} from '@/features/transcriptSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useTranscript = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchTranscriptSubject());
    } else {
      dispatch(setTranscriptData([]));
      dispatch(setCurrentPage('pleaseLogin'));
      dispatch(setInitialPage('upload'));
    }
  }, [dispatch, isAuthenticated]);
};

export default useTranscript;
