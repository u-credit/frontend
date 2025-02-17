'use client';
import { CurriSelectGroup } from '@/components';
import React, { useEffect, useState } from 'react';
import { fetchListFaculty } from '@/api/facultyApi';
import { SelectOption } from '@/types';
import { calculateCredit, createTranscript } from '@/api/transcriptApi';
import SubjectContainer from './SubjectContainer';
import { Box, Button, CircularProgress } from '@mui/material';
import { useTranscriptContext } from '@/app/contexts/TranscriptContext';
import { formatDataForCreateTranscript } from '@/utils/transcriptRecheckHelper';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/features/store';
import { updateUser } from '@/features/auth/authSlice';
import { setUserCurriGroupById } from '@/features/facultySlice';
import { loadBookmarksApi } from '@/features/bookmark/bookmarkSlice';

interface RecheckPageProps {
  file: File;
  onNext: () => void;
}

export default function RecheckPage({ file, onNext }: RecheckPageProps) {
  const {
    selectedCurriGroup,
    setSelectedCurriGroup,
    unmatchSubjects,
    setUnmatchSubjects,
    matchSubjects,
    setMatchSubjects,
  } = useTranscriptContext();
  const dispatch = useDispatch<AppDispatch>();
  const [facultyOptions, setFacultyOptions] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);

  const isCurriGroupComplete = () => {
    return Object.values(selectedCurriGroup).every(
      (field) => field.value !== '',
    );
  };

  const loadFaculty = async () => {
    try {
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
    } catch (error) {}
  };

  const calculate = async (): Promise<void> => {
    try {
      const body = {
        faculty: selectedCurriGroup.faculty.value,
        department: selectedCurriGroup.department.value,
        curriculum: selectedCurriGroup.curriculum.value,
        curriculumYear: selectedCurriGroup.curriculumYear.value,
      };
      const data = (await calculateCredit(file, body))?.data;
      const unmatchSubjects = data?.unmatchSubjects || [];
      setUnmatchSubjects(unmatchSubjects);

      const matchSubjects = data?.matchSubjects || [];
      setMatchSubjects(matchSubjects);
    } catch (error) {}
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await loadFaculty();
      await calculate();
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log('subjectDetail => ', unmatchSubjects);
  }, [unmatchSubjects]);

  const handleApplyCurriGroup = () => {
    const fetchData = async () => {
      setLoading(true);
      const startTime = Date.now();
      await loadFaculty();
      await calculate();
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 1000) {
        setTimeout(() => setLoading(false), 1000 - elapsedTime);
      } else setLoading(false);
    };

    fetchData();
  };

  const handleUploadTranscript = async () => {
    const data = formatDataForCreateTranscript(
      selectedCurriGroup,
      matchSubjects || [],
      unmatchSubjects || [],
    );

    const updatedData = (await createTranscript(data)).data.user;
    dispatch(updateUser(updatedData));
    dispatch(
      setUserCurriGroupById({
        facultyId: updatedData.faculty_id,
        departmentId: updatedData.department_id,
        curriculumId: updatedData.curr2_id,
        curriculumYear: updatedData.curriculum_year,
      }),
    );
    dispatch(loadBookmarksApi());
    onNext();
  };

  return (
    <div>
      <div className="flex flex-col md:gap-10 gap-5 justify-center ">
        <div className="flex flex-col gap-5 ">
          <div className="font-mitr font-medium text-center text-lg sm:text-xl md:text-2xl lg:text-3xl">
            ตรวจสอบหมวดหมู่รายวิชาของคุณ
          </div>
          <div className="text-md md:text-lg lg:text-xl text-center ">
            <div>
              ระบบได้ทำการดึงข้อมูลจากไฟล์ที่คุณทำการอัปโหลดลงมาในระบบเรียบร้อยแล้ว
            </div>
            <div className="text-md md:text-lg lg:text-xl text-primary-400">
              เพื่อความถูกต้องแม่นยำ กรุณาตรวจสอบและแก้ไขอีกครั้ง
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200"></div>
        <div className="flex flex-col md:flex-row md:gap-x-4 gap-y-2">
          <CurriSelectGroup
            selectedCurriGroup={selectedCurriGroup}
            facultyOptions={facultyOptions}
            setSelectedCurriGroup={setSelectedCurriGroup}
          />
          <Button
            onClick={handleApplyCurriGroup}
            disabled={isCurriGroupComplete() ? false : true}
          >
            บันทึก
          </Button>
        </div>
        <div className="border-t border-gray-200"></div>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="50vh"
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <div className="flex flex-col gap-10">
              <div className="font-mitr font-medium text-md md:text-lg lg:text-xl">
                รายวิชาที่ไม่ปรากฎในเล่มหลักสูตรของคุณ
              </div>
              {/* <div className="overflow-y-auto min-h-80 h-[30vh]"> */}
              <div>
                <SubjectContainer unmatchSubjects={unmatchSubjects} />
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                size="medium"
                variant="contained"
                // disabled={isSubjectComplete() ? false : true}
                onClick={handleUploadTranscript}
              >
                <div className="text-md md:text-lg font-semibold">ไปต่อ</div>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
