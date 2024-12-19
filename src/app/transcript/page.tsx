'use client';
import { useState } from 'react';
import CourseInfo from './components/CourseInfo';
import UploadTranscript from './components/UploadTranscript';
import { StudentInfo } from '@/Interfaces/studentInfo.interface';

export default function Home() {
  const [studentInfo, setStudenInfo] = useState<StudentInfo>({
    curr2_faculty_id: '',
    curr2_curr2_id: '',
    curr2_dept_id: '',
    curr2_curri_mapping_curri_id: '',
    cuAdmisCurrYearMappings_curr_year: '',
  });

  const handleStudentInfo = (data: StudentInfo) => {
    setStudenInfo(data);
    console.log(studentInfo);
  };

  return (
    <main className="flex flex-row bg-gray-100 min-h-[calc(100vh-48px)] w-full">
      <div className="w-full border-solid border-2 border-black px-20 my-[10px]">
        <div className="bg-white h-full border-2 border-black rounded-3xl p-10">
          <div className="flex flex-col gap-10 justify-center border-2 border-black">
            <div className="flex flex-col gap-5 border-2 border-rose-700">
              <div className="font-mitr font-medium text-[34px]/[44px] text-center border-2 border-rose-300">
                เริ่มตรวจสอบหน่วยกิต
              </div>
              <div className="text-[18px]/[26px] text-center border-2 border-rose-300">
                อัปโหลดทรานสคริปต์ของคุณ <br />
                เพื่อตรวจเช็คหน่วยกิตที่ลงไปแล้ว และหน่วยกิตที่ยังขาดอยู่
              </div>
            </div>
            <div className="border-t border-gray-200"></div>
            <div className="border-2 border-rose-700">
              <UploadTranscript onUploadSuccess={handleStudentInfo} />
            </div>
            <div>
              <CourseInfo />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
