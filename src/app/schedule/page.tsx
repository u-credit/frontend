'use client';
import { Button } from '@mui/material';
import Timetable from './components/timetable/components/Timetable';
import Tabs from './components/tabs/tabs';
import { CustomSelect } from '@/components';
import DownloadButton from './components/downloadButton/Button';
import { SelectOption } from '@/types';
import * as React from 'react';
import { AppDispatch, RootState } from '@/features/store';
import { useEffect, useState } from 'react';
import SortedExamSchedule from '../schedule/components/examschedule/SortedExamSchedule';
import { useDispatch, useSelector } from 'react-redux';
import { BookmarkItem } from '@/Interfaces';
import {
  selectScheduledItems,
  summaryCategoryShedule,
} from '@/features/bookmark/bookmarkSlice';
import {
  setSemester,
  setYear,
} from '@/features/selectorValueSlice';

export default function Home() {
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
  const [isExamSchedule, setIsExamSchedule] = useState(false);

  const [categoryCredit, setCategoryCredit] = useState<{
    [key: string]: number;
  }>(summaryCredit.categoryCredit);
  const [sumCredit, setSumCredit] = useState(summaryCredit.total);

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

  const handleExamSchedule = () => {
    setIsExamSchedule((isExamSchedule) => !isExamSchedule);
  };

  return (
    <main className="flex flex-row bg-gray-100 min-h-[calc(100vh-48px)] w-full">
      <div className="bg-white w-full sm:mx-[80px] px-[20px] sm:px-[40px] sm:pt-[56px] pt-[20px]">
        <div className="w-full flex justify-between items-center">
          <div className="flex gap-x-4 items-center">
            <div id="header-content" data-testid="header-content">
              {isExamSchedule ? 'ตารางสอบ' : 'ตารางเรียน'}
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
              onClick={handleExamSchedule}
              variant="outlined"
              sx={{ minWidth: '89px' }}
              data-testid="exam-schedule-button"
            >
              {isExamSchedule ? 'ตารางเรียน' : 'ตารางสอบ'}
            </Button>
            <DownloadButton />
          </div>
        </div>
        <div className="timetable-container mt-[20px]">
          {isExamSchedule ? (
            <div>
              <div  className="flex w-full">
                <div className="flex w-full flex-col mt-4">
                  <div className="w-full flex justify-center font-semibold">
                    กลางภาค
                  </div>
                  <SortedExamSchedule scheduledItems={scheduledItems} examType="midterm" />
                </div>

                <div className="flex w-full flex-col mt-4">
                  <div className="w-full flex justify-center font-semibold">
                    ปลายภาค
                  </div>
                  <SortedExamSchedule scheduledItems={scheduledItems} examType="final" />
                </div>
              </div>
            </div>
          ) : (
            <Timetable
              subjects={scheduledItems}
              section={scheduledItems.map((item: BookmarkItem) => ({
                subjectId: item.subjectId,
                selectedSection: item.section,
              }))}
            />
          )}
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
