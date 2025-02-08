'use client';
import { CurriSelectGroup } from '@/components';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { CurriGroup } from '@/Interfaces';
import { fetchListFaculty } from '@/api/facultyApi';
import { SelectOption } from '@/types';
import {
  CategoryGroup,
  SubjectTranscriptDto,
} from '@/Interfaces/transcript.interface';
import { calculateCredit } from '@/api/transcriptApi';
import SubjectContainer from './SubjectContainer';
import { Box, Button, CircularProgress } from '@mui/material';
import { useTranscriptContext } from '@/app/contexts/TranscriptContext';

interface RecheckPageProps {
  file: File;
  onNext: () => void;
}

export default function RecheckPage({ file, onNext }: RecheckPageProps) {
  const {
    categoryOptions,
    selectedCurriGroup,
    setSelectedCurriGroup,
    selectedCategory,
    setSelectCategory,
    allUnknowSubject,
    setAllUnknowSubject,
  } = useTranscriptContext();

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
      const allUnknowSubject = data?.unknowDetail || [];
      setAllUnknowSubject(allUnknowSubject);
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
    console.log('subjectDetail => ', allUnknowSubject);
  }, [allUnknowSubject]);

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

  const isSubjectComplete = () => {
    return allUnknowSubject?.every((subject) =>
      Object.values({
        category: subject.category,
        group: subject.group,
        subgroup: subject.subgroup,
        childgroup: subject.childgroup,
      }).every((value) => value !== null),
    );
  };

  return (
    <div>
      <div className="flex flex-col gap-10 justify-center ">
        <div className="flex flex-col gap-5 ">
          <div className="font-mitr font-medium text-[34px]/[44px] text-center ">
            ตรวจสอบหมวดหมู่รายวิชาของคุณ
          </div>
          <div className="text-[18px]/[26px] text-center ">
            <div>
              ระบบได้ทำการดึงข้อมูลจากไฟล์ที่คุณทำการอัปโหลดลงมาในระบบเรียบร้อยแล้ว
            </div>
            <div className="text-primary-400">
              เพื่อความถูกต้องแม่นยำ กรุณาตรวจสอบและแก้ไขอีกครั้ง
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200"></div>
        <div className="flex gap-x-10">
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
              <div className="font-mitr font-medium text-[18px]/[26px]">
                รายวิชาที่ไม่ปรากฎในเล่มหลักสูตรของคุณ
              </div>
              {/* <div className="overflow-y-auto min-h-80 h-[30vh]"> */}
              <div>
                <SubjectContainer allUnknowSubject={allUnknowSubject} />
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                size="large"
                variant="contained"
                disabled={isSubjectComplete() ? false : true}
                onClick={onNext}
              >
                <div className="text-lg font-semibold">ไปต่อ</div>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
