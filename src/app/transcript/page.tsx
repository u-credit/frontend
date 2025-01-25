'use client';
import { useEffect, useState } from 'react';
// import CourseInfo from './components/CourseInfo';
// import UploadTranscript from './components/UploadTranscript';
// import { StudentInfo } from '@/Interfaces/studentInfo.interface';
// import { Button } from '@mui/material';
import { CurriGroup } from '@/Interfaces';
import UploadTranscriptPage from './components/UploadTranscriptPage';
import RecheckPage from './components/RecheckPage';
import { initSelectOption } from '@/types';

export default function Home() {
  // const [studentInfo, setStudenInfo] = useState<StudentInfo>({
  //   faculty_id: '',
  //   dept_id: '',
  //   curr2_id: '',
  //   curri_id: '',
  //   curr_year: '',
  // });

  // const [uploadTranscriptSuccess, setUploadTranscriptSuccess] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>('upload');
  const [selectedCurriGroup, setSelectedCurriGroup] = useState<CurriGroup>({
    faculty: initSelectOption(),
    department: initSelectOption(),
    curriculum: initSelectOption(),
    curriculumYear: initSelectOption(),
  });

  const handleNext = (section: string) => {
    setCurrentSection(section);
  };

  // const handleStudentInfo = (data: StudentInfo) => {
  //   setStudenInfo(data);
  //   console.log(data);
  // };

  // const handleUploadTranscript = (success: boolean) => {
  //   setUploadTranscriptSuccess(success);
  // };

  // const handleCurriGroupChange = (curriGroup: CurriGroup) => {
  //   setSelectedCurriGroup(curriGroup);
  //   console.log('new curriGroup => ', curriGroup);
  // };

  // const isDatacomplete = () => {
  //   return (
  //     Object.values(selectedCurriGroup).every((value) => value !== '') &&
  //     uploadTranscriptSuccess
  //   );
  // };

  // useEffect(() => {
  //   console.log('isDatacomplete => ', isDatacomplete());
  // }, [selectedCurriGroup, uploadTranscriptSuccess]);

  return (
    <main className="flex flex-row bg-gray-100 min-h-[calc(100vh-48px)] w-full">
      {/* <div className="w-full border-solid px-20 my-[10px]">
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
      </div> */}
      <div className="w-full border-solid px-20 my-[10px]">
        <div className="bg-white h-full rounded-3xl p-10">
          {currentSection === 'upload' && (
            <UploadTranscriptPage
              selectedCurriGroup={selectedCurriGroup}
              setSelectedCurriGroup={setSelectedCurriGroup}
              onNext={() => handleNext('recheck')}
            />
          )}
          {currentSection === 'recheck' && (
            <RecheckPage
              selectedCurriGroup={selectedCurriGroup}
              setSelectedCurriGroup={setSelectedCurriGroup}
              onNext={() => handleNext('summary')}
            />
          )}
        </div>
      </div>
    </main>
  );
}
