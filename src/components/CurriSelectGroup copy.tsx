'use client';
import CustomSelectOutlined from './CustomSelectOutlined';
import { SelectOption } from '@/types';
import { useCallback, useEffect, useRef, useState } from 'react';
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
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>('');
  const [selectedCurriculumYear, setSelectedCurriculumYear] =
    useState<string>('');

  const prevCurriGroupRef = useRef<CurriGroup>({
    faculty: '',
    department: '',
    curriculum: '',
    curriculumYear: '',
  });

  const [selectedFacultyObj, setSelectedFacultyObj] =
    useState<SelectOption | null>(null);
  const [selectedDepartmentObj, setSelectedDepartmentObj] =
    useState<SelectOption | null>(null);
  const [selectedCurriculumObj, setSelectedCurriculumObj] =
    useState<SelectOption | null>(null);

  const handleFacultyChange = useCallback(
    (value: string) => {
      const selected = facultyOptions.find((option) => option.value === value);
      setSelectedFaculty(String(selected?.value || ''));
      setSelectedFacultyObj(selected || null);

      setSelectedDepartment('');
      setSelectedCurriculum('');
      setSelectedCurriculumYear('');
    },
    [facultyOptions],
  );

  const handleDepartmentChange = useCallback(
    (value: string) => {
      const departmentOptions = selectedFacultyObj?.children || [];

      const selected = departmentOptions.find(
        (option) => option.value === value,
      );
      setSelectedDepartment(String(selected?.value || ''));
      setSelectedDepartmentObj(selected || null);

      setSelectedCurriculum('');
      setSelectedCurriculumYear('');
    },
    [selectedFacultyObj],
  );

  const handleCurriculumChange = useCallback(
    (value: string) => {
      const curriculumOptions = selectedDepartmentObj?.children || [];
      const selected = curriculumOptions.find(
        (option) => option.value === value,
      );

      setSelectedCurriculum(String(selected?.value || ''));
      setSelectedCurriculumObj(selected || null);

      setSelectedCurriculumYear('');
    },
    [selectedDepartmentObj],
  );

  const handleCurriculumYearChange = useCallback(
    (value: string) => {
      const curriculumYearOptions = selectedCurriculumObj?.children || [];
      const selected = curriculumYearOptions.find(
        (option) => option.value === value,
      );

      setSelectedCurriculumYear(String(selected?.value || ''));
    },
    [selectedCurriculumObj],
  );

  useEffect(() => {
    if (selectedCurriGroup) {
      const facultyObj = facultyOptions.find(
        (option) => option.value === selectedCurriGroup.faculty,
      );
      setSelectedFacultyObj(facultyObj || null);

      if (facultyObj) setSelectedFaculty(selectedCurriGroup.faculty);
      const departmentObj = facultyObj?.children?.find(
        (option) => option.value === selectedCurriGroup.department,
      );
      if (departmentObj) setSelectedDepartment(selectedCurriGroup.department);
      setSelectedDepartmentObj(departmentObj || null);

      const curriculumObj = departmentObj?.children?.find(
        (option) => option.value === selectedCurriGroup.curriculum,
      );
      if (curriculumObj) setSelectedCurriculum(selectedCurriGroup.curriculum);

      setSelectedCurriculumObj(curriculumObj || null);

      const curriculumYearObj = curriculumObj?.children?.find(
        (option) => option.value === selectedCurriGroup.curriculumYear,
      );
      if (curriculumYearObj)
        setSelectedCurriculumYear(selectedCurriGroup.curriculumYear);
    }
  }, [selectedCurriGroup, facultyOptions]);

  const departmentOptions = selectedFacultyObj?.children || [];

  const curriculumOptions = selectedDepartmentObj?.children || [];

  const curriculumYearOptions = selectedCurriculumObj?.children || [];

  useEffect(() => {
    const newCurriGroup = {
      faculty: selectedFaculty,
      department: selectedDepartment,
      curriculum: selectedCurriculum,
      curriculumYear: selectedCurriculumYear,
    };
    if (
      prevCurriGroupRef.current.faculty !== newCurriGroup.faculty ||
      prevCurriGroupRef.current.department !== newCurriGroup.department ||
      prevCurriGroupRef.current.curriculum !== newCurriGroup.curriculum ||
      prevCurriGroupRef.current.curriculumYear !== newCurriGroup.curriculumYear
    ) {
      prevCurriGroupRef.current = newCurriGroup;
      onCurriGroupChange(newCurriGroup);
    }
  }, [
    selectedFaculty,
    selectedDepartment,
    selectedCurriculum,
    selectedCurriculumYear,
    onCurriGroupChange,
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
