'use client';
import { Button } from '@mui/material';
import Timetable from './components/timetable/components/Timetable';
import Tabs from './components/tabs/tabs';
import { CustomSelect } from '@/components';
import DownloadButton from './components/downloadButton/Button';
import { initSelectOption, SelectOption } from '@/types';

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
import {
  setCurrigroup,
  setSemester,
  setYear,
} from '@/features/selectorValueSlice';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import { fetchListSubjectByIds } from '@/api/subjectApi';
import { formatBookmarksDtoToItem } from '@/utils';

export default function Home() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch: AppDispatch = useDispatch();
  const { semester, year } = useSelector(
    (state: RootState) => state.selectorValue,
  );
  const summaryCredit = useSelector((state: RootState) =>
    summaryCategoryShedule(state),
  );
  const scheduledItems = useSelector((state: RootState) =>
    selectScheduledItems(state),
  );
  // const [isExamSchedule,setIsExamSchedule] = useState(false);

  const [categoryCredit, setCategoryCredit] = useState<{
    [key: string]: number;
  }>(summaryCredit.categoryCredit);
  const [sumCredit, setSumCredit] = useState(summaryCredit.total);


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
  
  const [selectedSemester, setSelectedSemester] = useState<string>(semester);
  const [selectedYear, setSelectedYear] = useState<string>(year);

  const handleSelectSemester = (value: string) => {
    setSelectedSemester(value);
    dispatch(setSemester(value));
  };

  const handleSelectYear = (value: string) => {
    setSelectedYear(value);
    dispatch(setYear(value));
  };

  const semesterOptions: SelectOption[] = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
  ];
  
  const yearOptions: SelectOption[] = [
    { label: '2563', value: '2563' },
    { label: '2564', value: '2564' },
    { label: '2565', value: '2565' },
    { label: '2566', value: '2566' },
  ];

  // const handleExamSchedule = () => {
  //   setIsExamSchedule((prev) => !prev);
  // }



  return (
    <main className="flex flex-row bg-gray-100 min-h-[calc(100vh-48px)] w-full">
      <div className="bg-white w-full sm:mx-[80px] px-[20px] sm:px-[40px] sm:pt-[56px] pt-[20px]">
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-x-4 items-center">
            <div id="header-content" data-testid="header-content">
              ตารางเรียน
            </div>
            <CustomSelect
              onSelectedValueChange={handleSelectSemester}
              selectOptions={semesterOptions}
              selectedValue={selectedSemester}
              label="ภาคเรียน"
            />
            <CustomSelect
              onSelectedValueChange={handleSelectYear}
              selectOptions={yearOptions}
              selectedValue={selectedYear}
              label="ปีการศึกษา"
            />
          </div>
          <div
            id="button-container"
            className="flex gap-[10px] items-center h-full"
            data-testid="button-container"
          >
            <Button
              variant="outlined"
              sx={{ minWidth: '89px' }}
              data-testid="exam-schedule-button"
            >
              ตารางสอบ
              {/* {isExamSchedule ? 'ตารางเรียน' : 'ตารางสอบ'} */}
            </Button>
            <DownloadButton />
          </div>
        </div>
        <div className="timetable-container mt-[20px]">
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
