import { CurriGroup } from '@/Interfaces';

export type SelectOption = {
  label: string;
  value: string;
  children?: SelectOption[];
};

export const initSelectOption = (): SelectOption => {
  return {
    label: '',
    value: '',
  };
};

export const initCurriGroup = (): CurriGroup => ({
  faculty: initSelectOption(),
  department: initSelectOption(),
  curriculum: initSelectOption(),
  curriculumYear: initSelectOption(),
});
