'use client';
import React, { Dispatch, SetStateAction, useState } from 'react';
import CourseInfo from './CourseInfo';
import { Button } from '@mui/material';
import { StudentInfo } from '@/Interfaces/studentInfo.interface';
import UploadTranscript from './UploadTranscript';
import { useTranscriptContext } from '@/app/contexts/TranscriptContext';

interface UploadTranscriptPageProps {
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  onNext: () => void;
}

export default function UploadTranscriptPage({
  file,
  setFile,
  onNext,
}: UploadTranscriptPageProps) {
  const { selectedCurriGroup } = useTranscriptContext();

  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    faculty_id: '',
    dept_id: '',
    curr2_id: '',
    curri_id: '',
    curr_year: '',
  });

  const [uploadTranscriptSuccess, setUploadTranscriptSuccess] = useState(false);

  const handleStudentInfo = (data: StudentInfo) => {
    setStudentInfo(data);
  };

  const handleUploadTranscript = (success: boolean) => {
    setUploadTranscriptSuccess(success);
  };

  const isDataComplete = () => {
    return (
      Object.values(selectedCurriGroup).every((field) => field.value !== '') &&
      uploadTranscriptSuccess
    );
  };

  return (
    <div>
      <div className="flex flex-col gap-10 justify-center ">
        <div className="flex flex-col gap-5 ">
          <div className="font-mitr font-medium text-[34px]/[44px] text-center ">
            เริ่มตรวจสอบหน่วยกิต
          </div>
          <div className="text-[18px]/[26px] text-center ">
            อัปโหลดทรานสคริปต์ของคุณ <br />
            เพื่อตรวจเช็คหน่วยกิตที่ลงไปแล้ว และหน่วยกิตที่ยังขาดอยู่
          </div>
        </div>
        <div className="border-t border-gray-200"></div>
        <div>
          <UploadTranscript
            extractStudentInfo={handleStudentInfo}
            uploadTranscriptSuccess={handleUploadTranscript}
            file={file}
            setFile={setFile}
          />
        </div>
        <div>
          <CourseInfo studentInfo={studentInfo} />
        </div>
        <div className="border-t border-gray-200"></div>
        <div className="flex justify-center">
          <Button
            size="large"
            variant="contained"
            disabled={isDataComplete() ? false : true}
            onClick={onNext}
          >
            <div className="text-lg font-semibold">เริ่มการคำนวณ</div>
          </Button>
        </div>
      </div>
    </div>
  );
}
