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
