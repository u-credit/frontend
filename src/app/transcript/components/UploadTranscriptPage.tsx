'use client';
import React, { useEffect, useState } from 'react';
import CourseInfo from './CourseInfo';
import { Button } from '@mui/material';
import { StudentInfo } from '@/Interfaces/studentInfo.interface';
import { CurriGroup } from '@/Interfaces';
import UploadTranscript from './UploadTranscript';

interface UploadTranscriptPageProps {
  selectedCurriGroup: CurriGroup;
  setSelectedCurriGroup: (curriGroup: CurriGroup) => void;
  onNext: () => void;
}

export default function UploadTranscriptPage({
  selectedCurriGroup,
  setSelectedCurriGroup,
  onNext,
}: UploadTranscriptPageProps) {
  const [studentInfo, setStudenInfo] = useState<StudentInfo>({
    faculty_id: '',
    dept_id: '',
    curr2_id: '',
    curri_id: '',
    curr_year: '',
  });

  const [uploadTranscriptSuccess, setUploadTranscriptSuccess] = useState(false);

  const handleStudentInfo = (data: StudentInfo) => {
    setStudenInfo(data);
    console.log(data);
  };

  const handleUploadTranscript = (success: boolean) => {
    setUploadTranscriptSuccess(success);
  };

  const handleCurriGroupChange = (curriGroup: CurriGroup) => {
    setSelectedCurriGroup(curriGroup);
    console.log('new curriGroup => ', curriGroup);
  };

  const isDatacomplete = () => {
    return (
      Object.values(selectedCurriGroup).every((value) => value !== '') &&
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
          />
        </div>
        <div>
          <CourseInfo
            studentInfo={studentInfo}
            onCurriGroupChange={handleCurriGroupChange}
          />
        </div>
        <div className="border-t border-gray-200"></div>
        <div className="flex justify-center">
          <Button
            size="large"
            variant="contained"
            disabled={isDatacomplete() ? false : true}
            onClick={onNext}
          >
            <div className="text-lg font-semibold">เริ่มการคำนวณ</div>
          </Button>
        </div>
      </div>
    </div>
  );
}
