import { FilterGroup } from '@/app/course/components/Sidebar';
import { initSelectOption } from '@/types';

const defaultFilterValues: FilterGroup = {
  courseCategory: [],
  yearLevel: initSelectOption(),
  classDay: [],
  classTime: [],
  faculty: initSelectOption(),
  department: initSelectOption(),
  curriculum: initSelectOption(),
};

export function isDefaultFilterValues(filterValues: FilterGroup): boolean {
  return (
    JSON.stringify(filterValues.courseCategory) ===
      JSON.stringify(defaultFilterValues.courseCategory) &&
    JSON.stringify(filterValues.classDay) ===
      JSON.stringify(defaultFilterValues.classDay) &&
    JSON.stringify(filterValues.classTime) ===
      JSON.stringify(defaultFilterValues.classTime) &&
    JSON.stringify(filterValues.yearLevel) ===
      JSON.stringify(defaultFilterValues.yearLevel) &&
    JSON.stringify(filterValues.faculty) ===
      JSON.stringify(defaultFilterValues.faculty) &&
    JSON.stringify(filterValues.department) ===
      JSON.stringify(defaultFilterValues.department) &&
    JSON.stringify(filterValues.curriculum) ===
      JSON.stringify(defaultFilterValues.curriculum)
  );
}
