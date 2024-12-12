'use client';
import CustomSelectOutlined from './CustomSelectOutlined';
import { SelectOption } from '@/types';
import { useEffect, useState } from 'react';
import { CurriGroup } from '@/Interfaces';

interface CurriSelectGroupProps {
  selectedCurriGroup: CurriGroup;
  facultyOptions: SelectOption[];
  onCurriGroupChange: (curriGroup: CurriGroup) => void;
}

export default function CurriSelectGroup({
  selectedCurriGroup,
  facultyOptions,
  onCurriGroupChange,
}: CurriSelectGroupProps) {
  const [selectedFaculty, setSelectedFaculty] = useState<string | number>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | number>(
    '',
  );
  const [selectedCurriculum, setSelectedCurriculum] = useState<string | number>(
    '',
  );
  const [selectedCurriculumYear, setSelectedCurriculumYear] = useState<
    string | number
  >('');

  const [selectedFacultyObj, setSelectedFacultyObj] =
    useState<SelectOption | null>(null);
  const [selectedDepartmentObj, setSelectedDepartmentObj] =
    useState<SelectOption | null>(null);
  const [selectedCurriculumObj, setSelectedCurriculumObj] =
    useState<SelectOption | null>(null);

  useEffect(() => {
    if (selectedCurriGroup) {
      setSelectedFaculty(selectedCurriGroup.faculty);
      setSelectedDepartment(selectedCurriGroup.department);
      setSelectedCurriculum(selectedCurriGroup.curriculum);
      setSelectedCurriculumYear(selectedCurriGroup.curriculumYear);
    }
  }, [selectedCurriGroup]);

  const departmentOptions = selectedFacultyObj?.children || [];

  const curriculumOptions = selectedDepartmentObj?.children || [];

  const curriculumYearOptions = selectedCurriculumObj?.children || [];

  const handleFacultyChange = (value: string) => {
    const selected = facultyOptions.find((option) => option.value === value);
    setSelectedFaculty(selected?.value || '');
    setSelectedFacultyObj(selected || null);

    setSelectedDepartment('');
    setSelectedCurriculum('');
    setSelectedCurriculumYear('');
  };

  const handleDepartmentChange = (value: string) => {
    const departmentOptions = selectedFacultyObj?.children || [];

    const selected = departmentOptions.find((option) => option.value === value);
    setSelectedDepartment(selected?.value || '');
    setSelectedDepartmentObj(selected || null);

    setSelectedCurriculum('');
    setSelectedCurriculumYear('');
  };

  const handleCurriculumChange = (value: string) => {
    const curriculumOptions = selectedDepartmentObj?.children || [];
    const selected = curriculumOptions.find((option) => option.value === value);

    setSelectedCurriculum(selected?.value || '');
    setSelectedCurriculumObj(selected || null);

    setSelectedCurriculumYear('');
  };

  const handleCurriculumYearChange = (value: string) => {
    const curriculumYearOptions = selectedCurriculumObj?.children || [];
    const selected = curriculumYearOptions.find(
      (option) => option.value === value,
    );

    setSelectedCurriculumYear(selected?.value || '');
  };

  useEffect(() => {
    onCurriGroupChange({
      faculty: selectedFaculty,
      department: selectedDepartment,
      curriculum: selectedCurriculum,
      curriculumYear: selectedCurriculumYear,
    });
  }, [
    selectedFaculty,
    selectedDepartment,
    selectedCurriculum,
    selectedCurriculumYear,
  ]);

  return (
    <>
      <CustomSelectOutlined
        onSelectedValueChange={handleFacultyChange}
        selectOptions={facultyOptions}
        selectedValue={String(selectedFaculty)}
        label="คณะ"
      />
      <CustomSelectOutlined
        onSelectedValueChange={handleDepartmentChange}
        selectOptions={departmentOptions}
        selectedValue={String(selectedDepartment)}
        label="ภาควิชา"
        disabled={!selectedFaculty}
      />
      <CustomSelectOutlined
        onSelectedValueChange={handleCurriculumChange}
        selectOptions={curriculumOptions}
        selectedValue={String(selectedCurriculum)}
        label="หลักสูตร"
        disabled={!selectedDepartment}
      />
      <CustomSelectOutlined
        onSelectedValueChange={handleCurriculumYearChange}
        selectOptions={curriculumYearOptions}
        selectedValue={String(selectedCurriculumYear)}
        label="เล่มหลักสูตร"
        disabled={!selectedCurriculum}
      />
    </>
  );
}
