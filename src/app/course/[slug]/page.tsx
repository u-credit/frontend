//frontend/src/app/course/[slug]/page.tsx
/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Button, CircularProgress, Tooltip } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';

import { SubjectDto } from '@/Interfaces';
import { AppDispatch, RootState } from '@/features/store';
import { fetchListSubjectByIds } from '@/api/subjectApi';
import { createReview, getReviews, getTeachingOptions } from '@/api/reviewApi';
import {
  addBookmark,
  removeBookmark,
  selectBookmarkDetail,
  selectIsBookmark,
} from '@/features/bookmark/bookmarkSlice';
import { addBookmarkApi, deleteBookmarkApi } from '@/api/bookmarkApi';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import { chipCategory } from '@/utils';
import { BookmarkModal } from '../components';
import {
  setInitialReviews,
  selectAllReviews,
  setAverageRating,
} from '@/features/review/reviewSlice';

import CustomTable from '@/app/course/components/CustomTable';
import ReviewForm from '@/app/review/components/ReviewForm';
import ReviewCard from '@/app/review/components/ReviewCard';
import RatingButtons from '@/app/review/components/RatingButtons';

import CustomAlert from '@/components/CustomAlert';
import { profanityFilter } from '@/utils/profanityFilter';
import AuthModal from '@/app/review/components/AuthModal';
import Backdrop from '@/components/Backdrop';
import CreateReviewDialog from '@/app/review/components/CreateReviewDialog';

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const { semester, year } = useSelector(
    (state: RootState) => state.selectorValue,
  );
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id;
  const bookmark = useSelector((state: RootState) => state.bookmark.items);
  const reviews = useSelector((state: RootState) => selectAllReviews(state));

  const [subjectDetail, setSubjectDetail] = useState<SubjectDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');
  const [openBookmarkModal, setOpenBookmarkModal] = useState(false);
  const [isModalMounted, setIsModalMounted] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  //const [averageRating, setAverageRating] = useState(0);
  const averageRating = useSelector(
    (state: RootState) => state.review.averageRating,
  );
  const [submitting, setSubmitting] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [rating, setRating] = useState(0);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedTeacherName, setSelectedTeacherName] = useState('');
  const [reviewText, setReviewText] = useState('');

  const userReviews = reviews.filter((review) => review.isOwner);
  const otherReviews = reviews.filter((review) => !review.isOwner);

  const [yearOptions, setYearOptions] = useState<string[]>([]);
  const [semesterOptions, setSemesterOptions] = useState<string[]>([]);
  const [teacherOptions, setTeacherOptions] = useState<string[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const hasBookmark = useSelector((state: RootState) =>
    selectIsBookmark(state, slug),
  );
  const bookmarkDetail = useSelector((state: RootState) =>
    selectBookmarkDetail(state, slug),
  );
  useEffect(() => {
    const fetchSubjectDetail = async () => {
      const response = await fetchListSubjectByIds({
        semester: Number(semester),
        year: Number(year),
        subjectIds: [slug],
      });

      if (response.data?.[0]) {
        setSubjectDetail(response.data[0]);
        await Promise.all([fetchTeachingOptions(), fetchReviews()]);
      }
      setIsLoading(false);
    };

    fetchSubjectDetail();
  }, [slug, semester, year]);

  useEffect(() => {
    setIsBookmarked(hasBookmark);
    setSelectedSection(bookmarkDetail?.section || '');
  }, [slug, bookmark]);

  const fetchTeachingOptions = async () => {
    const response = await getTeachingOptions(slug);
    if (response.data) {
      setYearOptions(response.data.years.map(String));
      setSemesterOptions(response.data.semesters.map(String));
      setTeacherOptions(response.data.teachers.map((t) => t.name));
    }
    setOptionsLoading(false);
  };

  const fetchReviews = async () => {
    try {
      const response = await getReviews(slug);
      if (!response?.data?.reviews) return;

      const reviews = response.data.reviews;
      if (!Array.isArray(reviews)) return;

      dispatch(setInitialReviews(reviews));
      dispatch(setAverageRating(response.data.averageRating || 0));

      const reviewsWithOwnership = reviews.map((review) => ({
        ...review,
        isOwner: review.isOwner,
      }));

      dispatch(setInitialReviews(reviewsWithOwnership));
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchReviews();
    }
  }, [slug, user?.id]);

  const handleToggleBookmark = async () => {
    setIsBookmarked(!isBookmarked);
    const bookmarkData = {
      subjectId: slug,
      section: selectedSection,
      semester: Number(semester),
      year: Number(year),
    };

    if (!isBookmarked) {
      dispatch(addBookmark(bookmarkData));
      if (isAuthenticated) {
        await addBookmarkApi({
          ...bookmarkData,
        });
      }
    } else {
      setSelectedSection('');
      dispatch(removeBookmark(slug));
      if (isAuthenticated) {
        await deleteBookmarkApi({
          ...bookmarkData,
        });
      }
    }
  };

  const handleSubmitReview = async (data: {
    rating: number;
    year: number;
    semester: number;
    teacherName: string;
    reviewText: string;
  }) => {
    if (!isAuthenticated) {
      setOpenAuthModal(true);
      setOpenReviewDialog(false);
      return;
    }

    const { rating, year, semester, teacherName, reviewText } = data;

    if (!year || !semester || !teacherName || rating === 0) {
      setSnackbarMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
      setOpenSnackbar(true);
      return;
    }

    const { isValid } = profanityFilter(reviewText);
    if (!isValid) {
      setSnackbarMessage('ไม่สามารถส่งความคิดเห็นได้ เนื่องจากมีคำไม่เหมาะสม');
      setOpenSnackbar(true);
      return;
    }

    setSubmitting(true);
    try {
      const reviewData = {
        subjectId: slug,
        rating,
        year,
        semester,
        teacherName,
        reviewText,
      };

      const response = await createReview(reviewData);
      if (response.data) {
        await fetchReviews();
        setOpenReviewDialog(false);
        setSnackbarMessage('เพิ่มรีวิวสำเร็จ');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage('เกิดข้อผิดพลาดในการเพิ่มรีวิว');
      setOpenSnackbar(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpen = () => {
    setIsModalMounted(true);
    document.documentElement.style.overflowY = 'hidden';
    requestAnimationFrame(() => {
      setOpenBookmarkModal(true);
    });
  };

  const handleClose = () => {
    setOpenBookmarkModal(false);
    setTimeout(() => {
      setIsModalMounted(false);
      document.documentElement.style.overflowY = 'auto';
    }, 300);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
        <CircularProgress />
        <div className="text-gray-600">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }
  return (
    <div id="course-page" className="bg-white font-bai-jamjuree">
      <div className="max-w-8xl mx-auto p-6">
        <div
          id="header-nav"
          className="flex justify-between items-center pb-3 w-full"
        >
          <Button
            id="back-button"
            variant="text"
            startIcon={<ArrowBackIosIcon />}
            sx={{ color: 'black', fontSize: '16px' }}
            onClick={() => router.back()}
          >
            กลับ
          </Button>
          <Button
            id="bookmarks-button"
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ minWidth: '130px' }}
            onClick={handleOpen}
          >
            วิชาที่บันทึกไว้
          </Button>
        </div>

        <div id="course-info" className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col">
              <h1
                id="course-title"
                className="text-2xl font-rubik font-semibold mt-2"
              >
                {subjectDetail?.subject_id}{' '}
                {subjectDetail?.subject_english_name}
              </h1>
              <div id="course-categories" className="flex flex-wrap gap-2 mt-2">
                {subjectDetail?.categories?.map((category) => (
                  <Tooltip
                    key={
                      String(category.category_id) + String(category.group_id)
                    }
                    title={chipCategory(category)}
                  >
                    <span className="inline-block border border-primary-500 text-primary-500 font-bai-jamjuree rounded-full px-3 py-1 text-sm font-normal">
                      {chipCategory(category)}
                    </span>
                  </Tooltip>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <Button
                id="bookmark-button"
                variant={isBookmarked ? 'outlined' : 'contained'}
                startIcon={isBookmarked ? <CheckIcon /> : <AddIcon />}
                sx={{
                  minWidth: '98px',
                  backgroundColor: isBookmarked ? 'white' : 'primary.main',
                  borderColor: isBookmarked ? 'primary.main' : 'transparent',
                  color: isBookmarked ? 'primary.main' : 'white',
                  '&:hover': {
                    backgroundColor: isBookmarked ? '#f5f5f5' : 'primary.dark',
                    borderColor: 'primary.main',
                  },
                }}
                onClick={handleToggleBookmark}
              >
                บันทึก
              </Button>
            </div>
          </div>
        </div>

        <div id="course-description" className="mb-6">
          <h2 className="text-xl font-medium font-mitr mb-2">
            คำอธิบายรายวิชา
          </h2>
          <p className="text-black border rounded-sm p-4 font-normal text-lg bg-gray-100 indent-16">
            {subjectDetail?.detail}
          </p>
        </div>

        <div
          id="course-schedule"
          className="mb-16 rounded-md overflow-hidden z-5"
        >
          {subjectDetail?.teach_table ? (
            <CustomTable teachTable={subjectDetail.teach_table} />
          ) : (
            <div>ไม่พบข้อมูลของตารางเรียน</div>
          )}
        </div>

        {/* <div id="review-section">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0 mb-5">
            <h2 className="text-xl font-medium font-mitr">เขียนรีวิว</h2>
            <span className="text-base font-normal font-bai-jamjuree text-primary-400 md:ml-5 mb-4 md:mb-0">
              *การรีวิวนี้จะเป็นแบบไม่ระบุตัวตน
            </span>
          </div>
          <Button
              variant="contained"
              onClick={() => {
                if (!isAuthenticated) {
                  setOpenAuthModal(true);
                  return;
                }
                setOpenReviewDialog(true);
              }}
              startIcon={<AddIcon />}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                minWidth: '120px'
              }}
            >
              เขียนรีวิว
            </Button>
            
            <CreateReviewDialog
            open={openReviewDialog}
            onClose={() => setOpenReviewDialog(false)}
            onSubmit={handleSubmitReview}
            subjectId={slug}
          />

          <ReviewForm
            rating={rating}
            selectedYear={selectedYear}
            selectedSemester={selectedSemester}
            selectedTeacherName={selectedTeacherName}
            reviewText={reviewText}
            setRating={setRating}
            setSelectedYear={setSelectedYear}
            setSelectedSemester={setSelectedSemester}
            setSelectedTeacherName={setSelectedTeacherName}
            setReviewText={setReviewText}
            handleSubmit={handleSubmitReview}
            yearOptions={yearOptions}
            semesterOptions={semesterOptions}
            teacherOptions={teacherOptions}
            isSubmitting={submitting}
            isLoading={optionsLoading}
            isAuthenticated={isAuthenticated}
            onAuthModalOpen={() => setOpenAuthModal(true)}
          />
          <CustomAlert
            open={openSnackbar}
            message={snackbarMessage}
            onClose={() => setOpenSnackbar(false)}
          />
          <AuthModal
            open={openAuthModal}
            onClose={() => setOpenAuthModal(false)}
          />
        </div> */}

        <hr className="mt-6 mb-12" />

        {userReviews.length > 0 && (
          <div id="user-reviews" className="mb-12">
            <h2 className="text-lg font-mitr font-medium mb-6">รีวิวของคุณ</h2>
            <div id="user-reviews-container">
              {userReviews.map((review) => (
                <ReviewCard
                  key={review.review_id}
                  subjectId={subjectDetail?.subject_id || ''}
                  reviewId={review.review_id}
                  rating={review.rating}
                  year={Number(review.year)}
                  semester={Number(review.semester)}
                  teacherName={review.teacherName}
                  reviewText={review.reviewText}
                  createdAt={review.createdAt}
                  likeCount={review.likeCount}
                  isLikedByCurrentUser={review.isLikedByCurrentUser || false}
                  isOwner={review.isOwner || false}
                  userId={review.userId}
                />
              ))}
            </div>
          </div>
        )}

        <div id="reviews-list" className="flex-col mb-6 mt-2">
          <h2 className="text-lg font-mitr font-medium mb-4 sm:mb-0">
            รีวิวจากคนอื่น ๆ
          </h2>

          <div
            id="rating-summary"
            className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between relative lg:-mt-10 -mt-7 mb-4"
          >
            <div className="order-2 xs:order-1 w-full sm:flex-1 mt-6 sm:mt-12 md:mt-12 lg:mt-16">
              <RatingButtons
                selectedRating={selectedRating}
                setSelectedRating={setSelectedRating}
                reviews={reviews.map((review) => ({
                  ...review,
                  year: review.year.toString(),
                  semester: review.semester.toString(),
                }))}
              />
            </div>
            <div className="order-1 sm:order-2 w-full sm:w-auto mt-6 sm:mt-9 md:mt-8 lg:mt-5 sm:ml-4 -mb-7">
              <div
                id="average-rating"
                className="w-full xs:w-auto font-rubik text-5xl lg:text-6xl font-semibold text-center rounded-lg p-4 mb-1 lg:p-6 bg-primary-100 text-primary-400"
              >
                {averageRating?.toFixed(1) || '0.0'}
                <span className="text-base font-normal text-black ml-1">
                  /5
                </span>
              </div>
            </div>
          </div>
          {otherReviews.length > 0 ? (
            <>
              <div id="reviews-container">
                {(() => {
                  const filteredReviews = otherReviews.filter(
                    (review) =>
                      !selectedRating || review.rating === selectedRating,
                  );

                  return filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                      <ReviewCard
                        key={review.review_id}
                        subjectId={subjectDetail?.subject_id || ''}
                        reviewId={review.review_id}
                        rating={review.rating}
                        year={Number(review.year)}
                        semester={Number(review.semester)}
                        teacherName={review.teacherName}
                        reviewText={review.reviewText}
                        createdAt={review.createdAt}
                        likeCount={review.likeCount}
                        isLikedByCurrentUser={
                          review.isLikedByCurrentUser || false
                        }
                        isOwner={review.isOwner || false}
                        userId={review.userId}
                      />
                    ))
                  ) : (
                    <div className="text-gray-400 text-center mt-8">
                      <p className="text-lg">
                        ยังไม่มีรีวิวจากคนอื่น ๆ ในขณะนี้
                      </p>
                    </div>
                  );
                })()}
              </div>
            </>
          ) : (
            <div className="text-gray-400 text-center mt-8">
              <p className="text-lg">
                ยังไม่มีรีวิวจากคนอื่น ๆ สำหรับรายวิชานี้
              </p>
            </div>
          )}
        </div>
      </div>
      {isModalMounted && (
        <>
          <Backdrop open={openBookmarkModal} onClose={handleClose} />
          {openBookmarkModal && (
            <BookmarkModal open={openBookmarkModal} onClose={handleClose} />
          )}
        </>
      )}
    </div>
  );
}
