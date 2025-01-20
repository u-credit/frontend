'use client';
import { CurriSelectGroup } from '@/components';
import React, { useEffect, useState } from 'react';
import SubjectCard from './SubjectCard';
import { CurriGroup } from '@/Interfaces';
import { fetchListFaculty } from '@/api/facultyApi';
import { SelectOption } from '@/types';

interface RecheckPageProps {
  selectedCurriGroup: CurriGroup;
  setSelectedCurriGroup: (curriGroup: CurriGroup) => void;
  onNext: () => void;
}

export default function RecheckPage({
  selectedCurriGroup,
  setSelectedCurriGroup,
  onNext,
}: RecheckPageProps) {
  const [facultyOptions, setFacultyOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
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

    loadFaculty();
  }, []);

  const handleCurriGroupChange = (curriGroup: CurriGroup) => {
    setSelectedCurriGroup(curriGroup);
    console.log('new curriGroup => ', curriGroup);
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
            onCurriGroupChange={handleCurriGroupChange}
          />
        </div>
        <div className="border-t border-gray-200"></div>
        <div className="font-mitr font-medium text-[18px]/[26px]">
          รายวิชาที่ไม่ปรากฎในเล่มหลักสูตรของคุณ
        </div>
        <div className="flex flex-col gap-5 overflow-y-auto min-h-80 h-[30vh]">
          <SubjectCard />
          <SubjectCard />
        </div>
      </div>
    </div>
  );
}
