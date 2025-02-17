import { fetchFaculty, setUserCurriGroupById } from '@/features/facultySlice';
import { AppDispatch, RootState } from '@/features/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useFaculty = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const {
    data: facultyData,
    loading,
    error,
  } = useSelector((state: RootState) => state.faculty);

  useEffect(() => {
    if (isAuthenticated && user && !facultyData && !loading) {
      dispatch(fetchFaculty());
    }
  }, [isAuthenticated, user, facultyData]);

  useEffect(() => {
    if (
      Array.isArray(facultyData) &&
      facultyData.length > 0 &&
      isAuthenticated &&
      user
    ) {
      dispatch(
        setUserCurriGroupById({
          facultyId: user.faculty_id ?? '',
          departmentId: user.department_id ?? '',
          curriculumId: user.curr2_id ?? '',
          curriculumYear: user.curriculum_year ?? '',
        }),
      );
    }
  }, [facultyData, isAuthenticated, user]);

  return { loading, error, facultyData };
};

export default useFaculty;
