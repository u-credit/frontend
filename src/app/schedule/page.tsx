'use client';
import { Button } from '@mui/material';
import Timetable from './components/timetable/components/Timetable';
import Tabs from './components/tabs/tabs';
import DownloadButton from './components/downloadButton/Button';
import * as React from 'react';
import { AppDispatch, RootState } from '@/features/store';
import { BookmarkItem } from '@/Interfaces';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookmark } from '@/api/bookmarkApi';
import {
  BookmarkStateItem,
  loadBookmarks,
  saveBookmarks,
  selectScheduledItems,
  setBookmarks,
  summaryCategoryShedule,
} from '@/features/bookmark/bookmarkSlice';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import { fetchListSubjectByIds } from '@/api/subjectApi';
import { formatBookmarksDtoToItem } from '@/utils';

export default function Home() {
  const dispatch: AppDispatch = useDispatch();
  const { semester, year } = useSelector(
    (state: RootState) => state.selectorValue,
  );
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const summaryCredit = useSelector((state: RootState) =>
    summaryCategoryShedule(state),
  );
  const [categoryCredit, setCategoryCredit] = useState<{
    [key: string]: number;
  }>(summaryCredit.categoryCredit);
  const [sumCredit, setSumCredit] = useState(summaryCredit.total);

  const scheduledItems = useSelector((state: RootState) =>
    selectScheduledItems(state),
  );

  useEffect(() => {
    const loadBookmark = async () => {
      try {
        const response = await fetchBookmark({
          semester: Number(semester),
          year: Number(year),
        });
        const data = response?.data || [];
        const formatData = formatBookmarksDtoToItem(data);
        const response2 = (
          await fetchListSubjectByIds({
            semester: Number(semester),
            year: Number(year),
            subjectIds: [...formatData.map((item) => item.subjectId)],
          })
        ).data;

        if (response.data.length > 0) {
          const updatedBookmarksWithDetail: BookmarkStateItem[] =
            formatData.map((item) => {
              const subject = response2.find(
                (subject) => subject.subject_id === item.subjectId,
              );
              return {
                ...item,
                detail: subject,
              };
            });

          saveBookmarks(semester, year, updatedBookmarksWithDetail);
          dispatch(setBookmarks(updatedBookmarksWithDetail));
        } else {
          saveBookmarks(semester, year, formatData);
          dispatch(setBookmarks(formatData));
          console.log('No subject details found for bookmarks');
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    };

    if (isAuthenticated) {
      loadBookmark();
    } else {
      dispatch(loadBookmarks());
    }
  }, [dispatch, isAuthenticated, semester, year]);

  useEffect(() => {
    setCategoryCredit(summaryCredit.categoryCredit);
    setSumCredit(summaryCredit.total);
  }, [summaryCredit]);

  return (
    <main className="flex flex-row bg-gray-100 min-h-[calc(100vh-48px)] w-full">
      <div className="bg-white w-full sm:mx-[80px] px-[20px] sm:px-[40px] sm:pt-[56px] pt-[20px]">
        <div className="w-full flex justify-between items-center">
          <div id="header-content" data-testid="header-content">
            ตารางเรียน
          </div>
          <div
            id="button-container"
            className="flex gap-[10px] mb-[20px]"
            data-testid="button-container"
          >
            <Button
              variant="outlined"
              sx={{ minWidth: '89px' }}
              data-testid="exam-schedule-button"
            >
              ตารางสอบ
            </Button>
            <DownloadButton />
          </div>
        </div>
        <div className="timetable-container">
          <Timetable
            subjects={scheduledItems}
            section={scheduledItems.map((item: BookmarkItem) => ({
              subjectId: item.subjectId,
              selectedSection: item.section,
            }))}
          />
        </div>

        <div className="text-primary-400 pt-5">
          หน่วยกิตรวมในตาราง {sumCredit} หน่วยกิต
        </div>

        <div className="my-[40px]">
          <Tabs sumCredit={sumCredit} categoryCredit={categoryCredit} />
        </div>
      </div>
    </main>
  );
}
