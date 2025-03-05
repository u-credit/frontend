'use client';
import {
  Button,
  Chip,
  AccordionDetails,
  Typography,
  AccordionSummary,
  Accordion,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CalculateIcon from '@mui/icons-material/Calculate';
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
import { useRouter } from 'next/navigation';
import {
  selectScheduledItems,
  summaryCategoryShedule,
} from '@/features/bookmark/bookmarkSlice';
import { setSemester, setYear } from '@/features/selectorValueSlice';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

  const router = useRouter();
  const handleOpenTranscriptPage = () => {
    router.push(`/transcript`);
  };

  return (
    <main className="flex flex-row bg-gray-100 min-h-[calc(100vh-48px)] w-full">
      <div className="bg-white w-full sm:mx-[80px] px-[20px] sm:px-[40px] sm:pt-[56px] pt-[40px]">
        <div className="w-full flex flex-wrap sm:flex-nowrap justify-between items-center">
          <div className="w-full sm:w-fit  flex items-center justify-between">
            <div className="flex gap-x-4 items-center ">
              <div
                id="header-content"
                data-testid="header-content"
                className="hidden sm:block"
              >
                {isExamSchedule ? 'ตารางสอบ' : 'ตารางเรียน'}
              </div>
              <CustomSelect
                onSelectedValueChange={handleSelectSemester}
                selectOptions={semesterOptions}
                selectedValue={selectedSemester}
                label="ภาคเรียน"
                sx={{
                  fontSize: { xs: '12px', sm: '14px' },
                }}
              />
              <CustomSelect
                onSelectedValueChange={handleSelectYear}
                selectOptions={yearOptions}
                selectedValue={selectedYear}
                label="ปีการศึกษา"
                sx={{
                  fontSize: { xs: '12px', sm: '14px' },
                }}
              />
            </div>
            <div className="block sm:hidden">
              <DownloadButton />
            </div>
          </div>

          <div
            id="button-container"
            className="flex flex-row-reverse mt-4 sm:mt-0 sm:flex-row gap-[10px] items-center w-full sm:w-auto justify-end"
            data-testid="button-container"
          >
            {isExamSchedule ? (
              <Button
                startIcon={<ChevronLeftIcon />}
                onClick={handleExamSchedule}
                variant="outlined"
                sx={{
                  minWidth: '89px',
                  fontSize: { xs: '12px', sm: '14px' },
                }}
                data-testid="exam-schedule-button"
              >
                ตารางเรียน
              </Button>
            ) : (
              <Button
                endIcon={<NavigateNextIcon />}
                onClick={handleExamSchedule}
                variant="outlined"
                sx={{
                  minWidth: '89px',
                  fontSize: { xs: '12px', sm: '14px' },
                }}
                data-testid="exam-schedule-button"
              >
                ตารางสอบ
              </Button>
            )}

            <div className="hidden sm:block">
              <DownloadButton />
            </div>
          </div>
        </div>

        <div className="timetable-container mt-[20px]">
          {isExamSchedule ? (
            <div>
              <div className="flex w-full mb-4">
                <div className="flex w-full flex-col mt-4">
                  <div className="w-full flex justify-center font-semibold">
                    กลางภาค
                  </div>
                  <SortedExamSchedule
                    scheduledItems={scheduledItems}
                    examType="midterm"
                  />
                </div>

                <div className="flex w-full flex-col mt-4">
                  <div className="w-full flex justify-center font-semibold">
                    ปลายภาค
                  </div>
                  <SortedExamSchedule
                    scheduledItems={scheduledItems}
                    examType="final"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-10">
              <Timetable
                subjects={scheduledItems}
                section={scheduledItems.map((item: BookmarkItem) => ({
                  subjectId: item.subjectId,
                  selectedSection: item.section,
                }))}
              />
            </div>
          )}
        </div>

        {sumCredit > 0 &&
          (Object.keys(categoryCredit).length === 0 ? (
            <div className="text-primary-400 pl-2">
              หน่วยกิตรวมในตาราง {sumCredit} หน่วยกิต
            </div>
          ) : (
            <Accordion
              aria-controls="panel1bh-content"
              sx={{
                borderRadius: 2,
                borderWidth: 1,
                boxShadow: 'none',
                backgroundColor: 'white',
                cursor: 'pointer',
                '&.Mui-expanded': {
                  margin: 0,
                },
                '&:before': {
                  display: 'none',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{
                  minHeight: 'unset !important',
                  '&.Mui-expanded': {
                    minHeight: 'unset !important',
                  },
                  '& .MuiAccordionSummary-content': {
                    marginTop: '12px !important',
                    marginBottom: '12px !important',
                    alignItems: 'center',
                  },
                }}
              >
                <Typography component="span" className="text-primary-400">
                  หน่วยกิตรวมในตาราง {sumCredit} หน่วยกิต
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <div className="bg-gray-100 rounded-lg p-2">
                  {Object.entries(categoryCredit).map(([key, value]) => (
                    <div key={key} className="flex m-2">
                      <div className="min-w-[100px]">{value} หน่วยกิต</div>
                      <Chip
                        key={key}
                        label={key}
                        size="small"
                        variant="outlined"
                        sx={{
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          '@media (max-width: 600px)': {
                            maxWidth: '200px',
                          },
                          '@media (max-width: 400px)': {
                            maxWidth: '180px',
                          },
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <Button
                    startIcon={<CalculateIcon />}
                    onClick={handleOpenTranscriptPage}
                    variant="contained"
                    sx={{
                      marginTop: 2,
                      minWidth: '89px',
                    }}
                  >
                    คำนวณหน่วยกิต
                  </Button>
                </div>
              </AccordionDetails>
            </Accordion>
          ))}

        <div className="mt-4">
          <Tabs sumCredit={sumCredit} categoryCredit={categoryCredit} />
        </div>
      </div>
    </main>
  );
}
