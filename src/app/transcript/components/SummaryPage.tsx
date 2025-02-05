'use client';
import * as React from 'react';
import { CurriSelectGroup } from '@/components';
import { BookmarkDto, CurriGroup } from '@/Interfaces';
import { SelectOption } from '@/types';
import { useEffect, useState } from 'react';
import { fetchListFaculty } from '@/api/facultyApi';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import { Button, FormControlLabel } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import SummaryTable, { Row } from './SummaryTable';
import { mockSelectedCurriGroup, scheduledData, transcriptData } from './mock';

import TabsContainer from './TabsContainer';
import { fetchRequiredCredit } from '@/api/transcriptApi';
import {
  calculateCurrentCredit,
  calculateRequiredCredit,
  calculateScheduledCredit,
  formatCategoryForTranscript,
} from '@/utils';
import {
  RequiredCreditDto,
  SubjectTranscriptDto,
} from '@/Interfaces/transcript.interface';
import { useTranscriptContext } from '@/app/contexts/TranscriptContext';

interface SummaryPageProps {
  onNext: (section: string) => void;
}
mockSelectedCurriGroup;
export default function SummaryPage({ onNext }: SummaryPageProps) {
  const { listCategory } = useTranscriptContext();
  const [selectedCurriGroup, setSelectedCurriGroup] = useState<CurriGroup>(
    mockSelectedCurriGroup,
  );
  const [tableData, setTableData] = useState<Row[]>([]);
  const [transcript, setTranscript] = useState<SubjectTranscriptDto[]>([]);
  const [schedule, setSchedule] = useState<BookmarkDto[]>([]);
  const [includeSchedule, setIncludeSchedule] = useState<boolean>(false);
  const [requiredCredit, setRequiredCredit] = useState<RequiredCreditDto[]>([]);

  const fetchRequiredCreditApi = async (): Promise<RequiredCreditDto[]> => {
    const data: RequiredCreditDto[] = (
      await fetchRequiredCredit({
        faculty_id: selectedCurriGroup.faculty.value,
        dept_id: selectedCurriGroup.department.value,
        curr2_id: selectedCurriGroup.curriculum.value,
        curri_id: '0105',
        curr_year: selectedCurriGroup.curriculumYear.value,
      })
    ).data;
    setRequiredCredit(data);
    return data;
  };

  const fetchTrancsriptApi = async (): Promise<SubjectTranscriptDto[]> => {
    const data: SubjectTranscriptDto[] = transcriptData; // await fetcht transcript จาก ucredit database
    setTranscript(data);
    return data;
  };

  const fetchScheduleApi = async (): Promise<BookmarkDto[]> => {
    const data: BookmarkDto[] = scheduledData; // await fetcht schedule จาก bookmark database
    setSchedule(data);
    return data;
  };

  useEffect(() => {
    if (listCategory.length === 0) return;
    const fetchData = async () => {
      const requiredCreditData = await fetchRequiredCreditApi();
      const transcriptData = await fetchTrancsriptApi();
      const scheduleData = await fetchScheduleApi();

      let newTableData = formatCategoryForTranscript(listCategory);
      newTableData = calculateRequiredCredit(newTableData, requiredCreditData);
      newTableData = calculateCurrentCredit(newTableData, transcriptData);
      newTableData = calculateScheduledCredit(newTableData, scheduleData);

      setTableData(newTableData);
    };

    fetchData();
  }, [listCategory]);

  const [facultyOptions, setFacultyOptions] = useState<SelectOption[]>([]);
  useEffect(() => {
    const loadFaculty = async () => {
      const data = (await fetchListFaculty())?.data || [];
      const facultyOptions: SelectOption[] = data.map((faculty) => ({
        label: faculty.faculty_name,
        value: faculty.faculty_id,
        children: faculty.department?.map((department) => ({
          label: department.department_name,
          value: department.department_id,
          children: department.curriculum?.map((curriculum) => ({
            label: curriculum.curriculum_name,
            value: curriculum.curriculum_id,
            children: curriculum.curriculum_year?.map((year) => ({
              label: year,
              value: year,
            })),
          })),
        })),
      }));
      setFacultyOptions(facultyOptions);
    };

    loadFaculty();
  }, []);

  const handleUploadTranscript = () => {
    console.log('upload new transcript');
    onNext('upload');
  };

  return (
    <main className="p-10 bg-white">
      <div className="flex flex-col gap-5">
        <div className="flex flex-row gap-2 flex-wrap justify-between items-center w-full">
          <span className="font-mitr font-medium whitespace-nowrap content-center">
            หลักสูตรของคุณ
          </span>

          <Button variant="outlined" onClick={() => {}}>
            แก้ไขหลักสูตร
          </Button>
        </div>
        <div className="flex flex-col mobile:flex-row mobile:gap-x-4 gap-y-2 mobile:gap-y-0">
          <CurriSelectGroup
            selectedCurriGroup={selectedCurriGroup}
            facultyOptions={facultyOptions}
            setSelectedCurriGroup={setSelectedCurriGroup}
          />
        </div>
      </div>
      <div className="bg-gray-200 w-full h-[1px] my-5 "></div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-5 md:gap-0">
          <div className="font-mitr font-medium nowrap">
            จากข้อมูลทรานสคริปต์ 2564/1 ถึง 2566/1
          </div>
          <div className="flex flex-col md:flex-row gap-5 items-center">
            <div className="flex flex-row gap-2 border-b-[1px] border-black hover:border-primary-400 hover:cursor-pointer hover:text-primary-400 active:text-primary-500 active:border-primary-500 font-rubik font-medium ease-out duration-200">
              <div className="pb-[1px]">
                <InsertDriveFileOutlinedIcon />
              </div>
              mytranscript.pdf
            </div>
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{ minWidth: '115px' }}
              onClick={handleUploadTranscript}
            >
              อัปโหลดทรานสคริปต์ใหม่
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
        <TabsContainer transcript={transcript} schedule={schedule} />
      </div>
    </main>
  );
}
