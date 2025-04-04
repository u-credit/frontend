'use client';
import CustomSelectOutlined from './CustomSelectOutlined';
import { initSelectOption, SelectOption } from '@/types';
import { CurriGroup } from '@/Interfaces';
import { Dispatch, SetStateAction } from 'react';

interface CurriSelectGroupProps {
  selectedCurriGroup: CurriGroup;
  setSelectedCurriGroup: Dispatch<SetStateAction<CurriGroup>>;
  facultyOptions: SelectOption[];
  showCurriculumYear?: boolean;
  errorFaculty?: boolean;
  errorDepartment?: boolean;
  errorCurriculum?: boolean;
  errorCurriculumYear?: boolean;
}

export default function CurriSelectGroup({
  selectedCurriGroup,
  setSelectedCurriGroup,
  facultyOptions,
  showCurriculumYear = true,
  errorFaculty = false,
  errorDepartment = false,
  errorCurriculum = false,
  errorCurriculumYear = false,
}: CurriSelectGroupProps) {
  const handleFacultyChange = (value: SelectOption) => {
    setSelectedCurriGroup((prev) => {
      return {
        ...prev,
        faculty: value,
        department: initSelectOption(),
        curriculum: initSelectOption(),
        curriculumYear: initSelectOption(),
      };
    });
  };

  const handleDepartmentChange = (value: SelectOption) => {
    setSelectedCurriGroup((prev) => {
      return {
        ...prev,
        department: value,
        curriculum: initSelectOption(),
        curriculumYear: initSelectOption(),
      };
    });
  };

  const handleCurriculumChange = (value: SelectOption) => {
    setSelectedCurriGroup((prev) => {
      return {
        ...prev,
        curriculum: value,
        curriculumYear: initSelectOption(),
      };
    });
  };

  const handleCurriculumYearChange = (value: SelectOption) => {
    setSelectedCurriGroup((prev) => {
      return {
        ...prev,
        curriculumYear: value,
      };
    });
  };

  return (
    <>
      <CustomSelectOutlined
        onSelectedValueChange={handleFacultyChange}
        selectOptions={facultyOptions}
        selectedValue={selectedCurriGroup.faculty}
        label="คณะ"
        error={errorFaculty}
      />
      <CustomSelectOutlined
        onSelectedValueChange={handleDepartmentChange}
        selectOptions={selectedCurriGroup.faculty.children || []}
        selectedValue={selectedCurriGroup.department}
        label="ภาควิชา"
        disabled={!selectedCurriGroup.faculty.value}
        error={errorDepartment}
      />
      <CustomSelectOutlined
        onSelectedValueChange={handleCurriculumChange}
        selectOptions={selectedCurriGroup.department.children || []}
        selectedValue={selectedCurriGroup.curriculum}
        label="หลักสูตร"
        disabled={!selectedCurriGroup.department.value}
        error={errorCurriculum}
      />
      {showCurriculumYear ? (
        <CustomSelectOutlined
          onSelectedValueChange={handleCurriculumYearChange}
          selectOptions={selectedCurriGroup.curriculum.children || []}
          selectedValue={selectedCurriGroup.curriculumYear}
          label="เล่มหลักสูตร"
          disabled={!selectedCurriGroup.curriculum.value}
          error={errorCurriculumYear}
        />
      ) : null}
    </>
  );
}
