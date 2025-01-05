'use client';
import { useEffect, useState } from 'react';
import CourseInfo from './components/CourseInfo';
import UploadTranscript from './components/UploadTranscript';
import { StudentInfo } from '@/Interfaces/studentInfo.interface';
import { Button } from '@mui/material';
import { CurriGroup } from '@/Interfaces';

export default function Home() {
  const [studentInfo, setStudenInfo] = useState<StudentInfo>({
    curr2_faculty_id: '',
    curr2_curr2_id: '',
    curr2_dept_id: '',
    curr2_curri_mapping_curri_id: '',
    cuAdmisCurrYearMappings_curr_year: '',
  });

  const [uploadTranscriptSuccess, setUploadTranscriptSuccess] = useState(false);

  const [selectedCurriGroup, setSelectedCurriGroup] = useState<CurriGroup>({
    faculty: '',
    department: '',
    curriculum: '',
    curriculumYear: '',
  });

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

  useEffect(() => {
    console.log('isDatacomplete => ', isDatacomplete());
  }, [selectedCurriGroup, uploadTranscriptSuccess]);

  return (
    <main className="flex flex-row bg-gray-100 min-h-[calc(100vh-48px)] w-full">
      <div className="w-full border-solid px-20 my-[10px]">
        <div className="bg-white h-full rounded-3xl p-10">
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
              >
                <div className="text-lg font-semibold">เริ่มการคำนวณ</div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
