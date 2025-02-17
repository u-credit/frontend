'use client';
import { CurriGroup } from '@/Interfaces';
import CustomSelectOutlinedDisable from './CustomSelectOutlinedDisable';
import { use, useEffect } from 'react';

interface CurriSelectGroupDisableProps {
  selectedCurriGroup: CurriGroup;
}

export default function CurriSelectGroupDisable({
  selectedCurriGroup,
}: CurriSelectGroupDisableProps) {
  return (
    <>
      <CustomSelectOutlinedDisable
        selectedValue={selectedCurriGroup.faculty}
        label="คณะ"
      />
      <CustomSelectOutlinedDisable
        selectedValue={selectedCurriGroup.department}
        label="ภาควิชา"
      />
      <CustomSelectOutlinedDisable
        selectedValue={selectedCurriGroup.curriculum}
        label="หลักสูตร"
      />
      <CustomSelectOutlinedDisable
        selectedValue={selectedCurriGroup.curriculumYear}
        label="เล่มหลักสูตร"
      />
    </>
  );
}
