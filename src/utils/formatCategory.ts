import { SubjectCategory } from '@/enums';
import { CategoryDto } from '@/Interfaces';

export function formatCategory(category: string): string {
  if (category == SubjectCategory.MAJOR) return 'วิชาเฉพาะ';
  else if (category == SubjectCategory.GENERAL) return 'วิชาศึกษาทั่วไป';
  return '';
}

export function chipCategory(category: CategoryDto): string {
  let text = '';
  if (category.group_name) text += category.group_name;
  if (category.subgroup_name) text += ' + ' + category.subgroup_name;
  return text;
}

export const getChipColor = (category: number): string => {
  if (category === 1) return '';
  else if (category === 2) return 'primary';
  else if (category === 3) return 'success';
  else if (category === 1) return '';
  return 'default';
};
