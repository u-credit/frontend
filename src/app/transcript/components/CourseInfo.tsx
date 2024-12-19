'use client';
import { fetchListFaculty } from '@/api/facultyApi';
import { CurriSelectGroup, CustomSelectOutlined } from '@/components';
import { CurriGroup, FacultyDto } from '@/Interfaces';
import { StudentInfo } from '@/Interfaces/studentInfo.interface';
import { SelectOption } from '@/types';
import React, { useEffect, useState } from 'react';

interface StudentInfoProps {
  studentInfo: StudentInfo;
}

export default function CourseInfo() {
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
