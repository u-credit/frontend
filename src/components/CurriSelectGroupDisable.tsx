'use client';
import CustomSelectOutlined from './CustomSelectOutlined';
import { SelectOption } from '@/types';
import { CurriGroup } from '@/Interfaces';

interface CurriSelectGroupProps {
  selectedCurriGroup: CurriGroup;
  facultyOptions: SelectOption[];
}

export default function CurriSelectGroup({
  selectedCurriGroup,
  facultyOptions,
}: CurriSelectGroupProps) {
  return (
    <>
      <CustomSelectOutlined
        onSelectedValueChange={() => {}}
        selectOptions={facultyOptions}
        selectedValue={selectedCurriGroup.faculty}
        label="คณะ"
        disabled={true}
      />
      <CustomSelectOutlined
        onSelectedValueChange={() => {}}
        selectOptions={selectedCurriGroup.faculty.children || []}
        selectedValue={selectedCurriGroup.department}
        label="ภาควิชา"
        disabled={true}
      />
      <CustomSelectOutlined
        onSelectedValueChange={() => {}}
        selectOptions={selectedCurriGroup.department.children || []}
        selectedValue={selectedCurriGroup.curriculum}
        label="หลักสูตร"
        disabled={true}
      />
      <CustomSelectOutlined
        onSelectedValueChange={() => {}}
        selectOptions={selectedCurriGroup.curriculum.children || []}
        selectedValue={selectedCurriGroup.curriculumYear}
        label="เล่มหลักสูตร"
        disabled={true}
      />
      
    </>
  );
}
