import * as React from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TinySubjectCard from './TinySubjectCard';
import CloseIcon from '@mui/icons-material/Close';
import TableChartIcon from '@mui/icons-material/TableChart';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/features/store';
import { ListSubjectByIdsQueryParams, SubjectDto } from '@/Interfaces';
import { useCallback, useEffect, useState } from 'react';
import { fetchListSubjectByIds } from '@/api/subjectApi';
import { fetchBookmark } from '@/api/bookmarkApi';
import { setBookmarks } from '@/features/bookmark/bookmarkSlice';
import { selectIsAuthenticated } from '@/features/auth/authSlice';

interface BookmarkModalProps {
  open: boolean;
  onClose: () => void;
}

export default function BookmarkModal({ open, onClose }: BookmarkModalProps) {
  const dispatch = useDispatch();
  const { semester, year, curriGroup } = useSelector(
    (state: RootState) => state.selectorValue,
  );
  const bookmarks = useSelector((state: RootState) => state.bookmark.items);
  const router = useRouter();
  const handleOpenSchedule = () => {
    router.push(`/schedule`);
  };
  const [listSubjects, setListSubjects] = useState<SubjectDto[]>([]);

  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    const loadBookmark = async () => {
      try {
        const data =
          (
            await fetchBookmark({
              semester: Number(semester),
              year: Number(year),
            })
          )?.data || [];
        dispatch(
          setBookmarks(
            data.map((item) => {
              return {
                subjectId: item.subject_id,
                semester: item.semester,
                year: item.year,
                selectedSection: item.section,
              };
            }),
          ),
        );
      } catch (error) {
        console.error('Error loading bookmark:', error);
      }
    };
    if (isAuthenticated) {
      loadBookmark();
    }
  }, [dispatch, isAuthenticated, semester, year]);

  const loadSubjects = useCallback(
    async (isLoadMore = false) => {
      const getSubjectParams = (): ListSubjectByIdsQueryParams => ({
        semester: Number(semester),
        year: Number(year),
        subjectIds: bookmarks.map((item) => item.subjectId),
        ...(curriGroup &&
          curriGroup.faculty &&
          curriGroup.department &&
          curriGroup.curriculum &&
          curriGroup.curriculumYear && {
            facultyId: curriGroup.faculty,
            departmentId: curriGroup.department,
            curriculumId: curriGroup.curriculum,
            curriculumYear: curriGroup.curriculumYear,
          }),
      });

      const params = getSubjectParams();

      try {
        const response = await fetchListSubjectByIds(params);
        const newSubjects = response?.data || [];
        setListSubjects((prev) =>
          isLoadMore ? [...prev, ...newSubjects] : newSubjects,
        );
      } catch (error) {
        console.error('Error loading subjects:', error);
      } finally {
      }
    },
    [bookmarks, curriGroup, semester, year],
  );

  useEffect(() => {
    if (bookmarks.length > 0) {
      loadSubjects();
    }
  }, [bookmarks]);

  if (!open) return null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="flex flex-col bg-white p-5 gap-y-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-[10px] max-w-4xl w-full ">
        <div className="flex justify-between items-center">
          <span className="font-bold text-xl">วิชาที่บันทึกไว้</span>
          <div className="flex gap-x-5">
            <Button
              variant="contained"
              startIcon={<TableChartIcon />}
              sx={{ minWidth: '115px' }}
              onClick={handleOpenSchedule}
            >
              จัดตารางเรียน
            </Button>
            <IconButton
              aria-label="delete"
              sx={{ padding: 0 }}
              size="large"
              onClick={onClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </div>
        </div>
        <div className=" overflow-y-auto">
          <div className="flex flex-col gap-y-5 max-h-[80vh]">
            {bookmarks
              .filter(
                (bookmark) =>
                  bookmark.semester === Number(semester) &&
                  bookmark.year === Number(year),
              )
              .map((item) => (
                <TinySubjectCard
                  key={item.subjectId}
                  subjectDetail={
                    listSubjects.find(
                      (subject) => subject.subject_id === item.subjectId,
                    ) || ({} as SubjectDto)
                  }
                />
              ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
