'use client';
import { Button, Chip, Tooltip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import CreateIcon from '@mui/icons-material/Create';
import { useEffect, useState } from 'react';
import Backdrop from '@/components/Backdrop';
import ModalAddCategory from '../ModalAddCategory';
import { SubjectTranscriptDto } from '@/Interfaces/transcript.interface';
import { CategoryItem, Review } from '@/Interfaces';
import { chipCategoryItem, getChipColor } from '@/utils';
import EditReviewDialog from '@/app/review/components/EditReviewDialog';
import { useSummaryContext } from '@/app/contexts/SummaryContext';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateReviewDialog from '@/app/review/components/CreateReviewDialog';
import { useDispatch, useSelector } from 'react-redux';
import { deleteBookmarkApi } from '@/api/bookmarkApi';
import {
  loadBookmarksApi,
  removeBookmark,
} from '@/features/bookmark/bookmarkSlice';
import { AppDispatch, RootState } from '@/features/store';
import { fetchCalculateSchedule } from '@/features/scheduleSlice';
export interface SummarySubject extends SubjectTranscriptDto {
  categories: CategoryItem[];
}
interface SummarySubjectCardProps {
  subject: SummarySubject;
  subjectFlag: string;
}
export default function SummarySubjectCard({
  subject,
  subjectFlag,
}: SummarySubjectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { myTsReview } = useSummaryContext();

  const handleEditCategory = (): void => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    document.documentElement.style.overflowY = 'auto';
  };

  useEffect(() => {
    if (isModalOpen) {
      document.documentElement.style.overflowY = 'hidden';
    }
  }, [isModalOpen]);

  const handleEditReview = async () => {};

  const handleCreateReview = async () => {};

  const [review, setReview] = useState<Review | null>(null);
  useEffect(() => {
    const data = myTsReview?.find((r) => r.subjectId === subject.subject_id);
    setReview(data || null);
  }, [myTsReview, subject.subject_id]);

  const handleOnClickReview = () => {
    if (review) {
      setEditDialogOpen(true);
    } else {
      setCreateDialogOpen(true);
    }
  };

  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const { semester, year } = useSelector(
    (state: RootState) => state.selectorValue,
  );
  const handleDeleteSchedule = async () => {
    if (Number(semester) == subject.semester && Number(year) == subject.year) {
      dispatch(removeBookmark(subject.subject_id));
    }
    if (isAuthenticated) {
      const data = (
        await deleteBookmarkApi({
          subjectId: subject.subject_id,
          semester: Number(subject.semester),
          year: Number(subject.year),
        })
      ).data;
      if (data.success) {
        dispatch(fetchCalculateSchedule(false));
        dispatch(loadBookmarksApi());
      }
    }
  };

  return (
    <>
      <div className="flex flex-col mobile:flex-row justify-between border-[1px] border-gray-300 rounded-lg">
        <div className="flex flex-col gap-y-2 p-4">
          <div
            id="row1"
            className="flex flex-wrap flex-row gap-x-4 gap-y-2 items-center "
          >
            <div className="font-rubik font-medium text-md md:text-lg">
              {subject.subject_id}
            </div>
            <div className="font-rubik font-medium text-md md:text-lg">
              {subject.subject_ename}
            </div>
            {subject.semester && subject.year && (
              <div className="self-center">
                ปี {subject.year} เทอม {subject.semester}
              </div>
            )}
            {subject.categories?.length > 0 &&
              subject.categories.map((category: CategoryItem) => (
                <Tooltip
                  title={chipCategoryItem(category)}
                  key={category.category + category.group + category.subgroup}
                >
                  <Chip
                    label={chipCategoryItem(category)}
                    size="small"
                    variant="outlined"
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: {
                        xs: '200px',
                        sm: '300px',
                        md: '500px',
                        lg: '600px',
                        xl: '700px',
                      },
                    }}
                    color={
                      getChipColor(category.category) as
                        | 'default'
                        | 'primary'
                        | 'secondary'
                        | 'error'
                        | 'info'
                        | 'success'
                        | 'warning'
                    }
                  />
                </Tooltip>
              ))}
          </div>
          <div id="row2" className="flex flex-row gap-4 ">
            <h4>{subject.credit} หน่วยกิต</h4>
          </div>
        </div>
        <div
          id="button-area"
          className="flex flex-col pb-4 mobile:pb-0 justify-center gap-y-1 px-4 text-nowrap"
        >
          <Button
            size="small"
            variant="outlined"
            startIcon={<CreateIcon />}
            onClick={() => handleEditCategory()}
            sx={{
              borderWidth: '2px',
              borderColor: 'primary.400',
              '&:hover': {
                borderWidth: '2px',
                borderColor: 'primary.400',
              },
            }}
          >
            แก้ไขหมวดหมู่
          </Button>
          {subjectFlag === 'transcript' && (
            <Button
              size="small"
              variant="contained"
              startIcon={<StarIcon />}
              onClick={handleOnClickReview}
            >
              {review ? 'แก้ไขรีวิว' : 'เพิ่มรีวิว'}
            </Button>
          )}

          {subjectFlag === 'schedule' && (
            <Button
              size="small"
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteSchedule}
            >
              ลบ
            </Button>
          )}
        </div>
      </div>
      <ModalAddCategory
        open={isModalOpen}
        onClose={handleCloseModal}
        subject={subject}
        isSubjectAddCategory={subject.category !== null}
        isUpdateOnSubmit={true}
        subjectFlag={subjectFlag}
      />
      {editDialogOpen && (
        <EditReviewDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSubmit={handleEditReview}
          initialData={{
            rating: review?.rating || 0,
            year: review?.year || 0,
            semester: review?.semester || 0,
            teacherName: review?.teacherName || '',
            reviewText: review?.reviewText || '',
          }}
          subjectId={subject.subject_id}
        />
      )}
      {createDialogOpen && (
        <CreateReviewDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSubmit={handleCreateReview}
          subjectId={subject.subject_id}
        />
      )}
    </>
  );
}
