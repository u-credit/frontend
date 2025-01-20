'use client';
import { fetchListFaculty } from '@/api/facultyApi';
import { CurriSelectGroup } from '@/components';
import { CurriGroup } from '@/Interfaces';
import { StudentInfo } from '@/Interfaces/studentInfo.interface';
import { SelectOption } from '@/types';
import React, { useEffect, useState } from 'react';

interface StudentInfoProps {
  studentInfo: StudentInfo;
  onCurriGroupChange: (curriGroup: CurriGroup) => void;
}

export default function CourseInfo({
  studentInfo,
  onCurriGroupChange,
}: StudentInfoProps) {
  const [facultyOptions, setFacultyOptions] = useState<SelectOption[]>([]);

  const [selectedCurriGroup, setSelectedCurriGroup] = useState<CurriGroup>({
    faculty: '',
    department: '',
    curriculum: '',
    curriculumYear: '',
  });

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

  useEffect(() => {
    const curriGroup = {
      faculty: studentInfo.faculty_id,
      department: studentInfo.dept_id,
      curriculum: studentInfo.curr2_id,
      curriculumYear: studentInfo.curr_year,
    };
    setSelectedCurriGroup(curriGroup);
  }, [studentInfo]);

  useEffect(() => {
    onCurriGroupChange(selectedCurriGroup);
  }, [selectedCurriGroup]);

  const handleCurriGroupChange = (curriGroup: CurriGroup) => {
    setSelectedCurriGroup(curriGroup);
    console.log('new curriGroup => ', curriGroup);
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="font-mitr font-medium text-xl">ข้อมูลหลักสูตรของคุณ</div>
      <div className="flex gap-x-10">
        <CurriSelectGroup
          selectedCurriGroup={selectedCurriGroup}
          facultyOptions={facultyOptions}
          onCurriGroupChange={handleCurriGroupChange}
        />
      </div>
    </div>
  );
}
