import { SubjectCategory } from '@/enums';

export function formatCategory(category: string): string {
  if (category == SubjectCategory.MAJOR) return 'วิชาเฉพาะ';
  else if (category == SubjectCategory.GENERAL) return 'วิชาศึกษาทั่วไป';
  return '';
}
