'use client';
import * as React from 'react';
import { CurriSelectGroupDisable } from '@/components';
import { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import { Button, FormControlLabel } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SummaryTable, { Row } from './SummaryTable';
import DeleteIcon from '@mui/icons-material/Delete';
import TabsContainer from './TabsContainer';
import { fetchRequiredCredit } from '@/api/transcriptApi';
import {
  calculateCurrentCredit,
  calculateRequiredCredit,
  calculateScheduledCredit,
  findStartEnd,
  formatCategoryForTranscript,
} from '@/utils';
import { RequiredCreditDto } from '@/Interfaces';
import { useTranscriptContext } from '@/app/contexts/TranscriptContext';
import { useDispatch, useSelector } from 'react-redux';
import {
  BookmarkStateItem,
  editBookmark,
  selectScheduledItems,
} from '@/features/bookmark/bookmarkSlice';
import { calculateBookmark } from '@/api/bookmarkApi';
import { AppDispatch, RootState } from '@/features/store';
import { selectUser } from '@/features/auth/authSlice';
import { selectUserFacultyOptions } from '@/features/facultySlice';
import {
  deleteTranscriptApi,
  selectTranscripts,
} from '@/features/transcriptSlice';

interface SummaryPageProps {
  onNext: (section: string) => void;
}
export default function SummaryPage({ onNext }: SummaryPageProps) {
  const schedule = useSelector(selectScheduledItems);
  const transcriptSubject = useSelector(selectTranscripts);
  const { listCategory, selectedCurriGroup } = useTranscriptContext();
  const { semester, year } = useSelector(
    (state: RootState) => state.selectorValue,
  );
  const isFirstFetchSchedule = useSelector(
    (state: RootState) => state.bookmark.isFirstFetch,
  );
  const user = useSelector(selectUser);
  const userFacultyOptions = useSelector(selectUserFacultyOptions);

  const dispatch: AppDispatch = useDispatch();

  const [tableData, setTableData] = useState<Row[]>([]);
  const [includeSchedule, setIncludeSchedule] = useState<boolean>(false);
  const [requiredCredit, setRequiredCredit] = useState<RequiredCreditDto[]>([]);
  const [startYear, setStartYear] = useState<string>('');
  const [startSemester, setStartSemester] = useState<string>('');
  const [endYear, setEndYear] = useState<string>('');
  const [endSemester, setEndSemester] = useState<string>('');
  const fetchRequiredCreditApi = async (): Promise<RequiredCreditDto[]> => {
    const data: RequiredCreditDto[] = (
      await fetchRequiredCredit({
        faculty: selectedCurriGroup.faculty.value || user?.faculty_id || '',
        department:
          selectedCurriGroup.department.value || user?.department_id || '',
        curriculum: selectedCurriGroup.curriculum.value || user?.curr2_id || '',
        curriculumYear:
          selectedCurriGroup.curriculumYear.value ||
          user?.curriculum_year ||
          '',
      })
    ).data;
    setRequiredCredit(data);
    return data;
  };

  const fetchCalculateScheduledCredit = async (): Promise<
    BookmarkStateItem[]
  > => {
    const data = (
      await calculateBookmark({
        semester: Number(semester),
        year: Number(year),
        isShow: true,
      })
    ).data;

    const updatedSchedule = schedule.map((s) => {
      const matchItem = data.result.find(
        (item) => item.subject_id === s.subjectId,
      );
      if (matchItem) {
        return {
          ...s,
          category: matchItem.category,
          group: matchItem.group,
          subgroup: matchItem.subgroup,
        };
      }
      return s;
    });

    dispatch(editBookmark(updatedSchedule));
    return updatedSchedule;
  };

  const fetchData = async (listCategory: any) => {
    const requiredCreditData = await fetchRequiredCreditApi();
    const newSchedule = await fetchCalculateScheduledCredit();

    let newTableData = formatCategoryForTranscript(listCategory);
    newTableData = calculateRequiredCredit(newTableData, requiredCreditData);
    newTableData = calculateCurrentCredit(newTableData, transcriptSubject);
    newTableData = calculateScheduledCredit(newTableData, newSchedule);

    setTableData(newTableData);
    const { startSemester, startYear, endSemester, endYear } =
      findStartEnd(transcriptSubject);

    setStartYear(startYear + 543);
    setStartSemester(startSemester);
    setEndYear(endYear + 543);
    setEndSemester(endSemester);
  };

  useEffect(() => {
    if (listCategory.length > 0 && isFirstFetchSchedule && transcriptSubject) {
      fetchData(listCategory);
    }
  }, [listCategory, isFirstFetchSchedule, transcriptSubject]);

  const handleUploadTranscript = () => {
    onNext('upload');
  };

  const handleDeleteTranscript = () => {
    dispatch(deleteTranscriptApi());
  };

  return (
    <main className="p-10 bg-white">
      <div className="flex flex-col gap-5">
        <div className="flex flex-row gap-2 flex-wrap justify-between items-center w-full">
          <span className="font-mitr font-medium whitespace-nowrap content-center">
            หลักสูตรของคุณ
          </span>
        </div>
        <div className="flex flex-col mobile:flex-row mobile:gap-x-4 gap-y-2 mobile:gap-y-0">
          <CurriSelectGroupDisable selectedCurriGroup={userFacultyOptions} />
        </div>
      </div>
      <div className="bg-gray-200 w-full h-[1px] my-5 "></div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-5 md:gap-0">
          <div className="font-mitr font-medium nowrap">
            จากข้อมูลทรานสคริปต์ {startYear}/{startSemester} ถึง {endYear}/
            {endSemester}
          </div>
          <div className="flex flex-col md:flex-row gap-5 items-center">
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{ minWidth: '115px' }}
              onClick={handleUploadTranscript}
            >
              อัปโหลดทรานสคริปต์ใหม่
            </Button>
            <Button
              variant="contained"
              startIcon={<DeleteIcon />}
              sx={{ minWidth: '115px' }}
              onClick={handleDeleteTranscript}
            >
              ลบทรานสคริปต์
            </Button>
          </div>
        </div>
        <FormControlLabel
          sx={{ margin: '0' }}
          control={
            <Checkbox
              checked={includeSchedule}
              onChange={() => {
                setIncludeSchedule((prev) => !prev);
              }}
              sx={{ padding: 0, color: 'grey.300', marginRight: '16px' }}
            />
          }
          label="นำหน่วยกิตจากตารางเรียนที่จัดไว้มาคำนวนด้วย"
        />
        <SummaryTable data={tableData} showScheduleCredit={includeSchedule} />
        <TabsContainer />
      </div>
    </main>
  );
}
