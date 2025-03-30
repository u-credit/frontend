'use client';
import { fetchListFaculty } from '@/api/facultyApi';
import { useTranscriptContext } from '@/app/contexts/TranscriptContext';
import { CurriSelectGroup } from '@/components';
import { StudentInfo } from '@/Interfaces/studentInfo.interface';
import { SelectOption } from '@/types';
import React, { useEffect, useState } from 'react';

interface StudentInfoProps {
  studentInfo: StudentInfo;
}

export default function CourseInfo({ studentInfo }: StudentInfoProps) {
  const { selectedCurriGroup, setSelectedCurriGroup } = useTranscriptContext();
  const [facultyOptions, setFacultyOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    const loadData = async () => {
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

        if (facultyOptions.length === 0) return;

        const faculty = facultyOptions.find(
          (f) => f.value === studentInfo.faculty_id,
        );
        const department = faculty?.children?.find(
          (d) => d.value === studentInfo.dept_id,
        );
        const curriculum = department?.children?.find(
          (c) => c.value === studentInfo.curr2_id,
        );
        const curriculumYear = curriculum?.children?.find(
          (y) => y.value === studentInfo.curr_year,
        );

        const curriGroup = {
          faculty: {
            label: faculty?.label || '',
            value: studentInfo.faculty_id,
            children: faculty?.children || [],
          },
          department: {
            label: department?.label || '',
            value: studentInfo.dept_id,
            children: department?.children || [],
          },
          curriculum: {
            label: curriculum?.label || '',
            value: studentInfo.curr2_id,
            children: curriculum?.children || [],
          },
          curriculumYear: {
            label: curriculumYear?.label || '',
            value: studentInfo.curr_year,
            children: curriculumYear?.children || [],
          },
        };

        setSelectedCurriGroup(curriGroup);
      } catch (error) {
        console.error('Error loading faculty:', error);
      }
    };

    loadData();
  }, [studentInfo]);

  return (
    <div className="flex flex-col md:gap-10 gap-5">
      <div className="font-mitr font-medium text-lg md:text-xl">ข้อมูลหลักสูตรของคุณ</div>
      <div className="flex flex-col md:flex-row md:gap-x-4 gap-y-2 md:gap-y-2">
        <CurriSelectGroup
          selectedCurriGroup={selectedCurriGroup}
          facultyOptions={facultyOptions}
          setSelectedCurriGroup={setSelectedCurriGroup}
        />
      </div>
    </div>
  );
}
