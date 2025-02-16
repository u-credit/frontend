import { CurriGroup, FacultyDto } from '@/Interfaces';
import { SelectOption } from '@/types';

export const formatFacultyOption = (faculty: FacultyDto[]): SelectOption[] => {
  const facultyOptions: SelectOption[] = faculty.map((faculty) => ({
    label: faculty.faculty_name,
    value: faculty.faculty_id,
    children: faculty.department?.map((department) => ({
      label: department.department_name,
      value: department.department_id,
      children: department.curriculum?.map((curriculum) => ({
        label: curriculum.curriculum_name,
        value: curriculum.curriculum_id,
        children: curriculum.curriculum_year?.map((year) => ({
          label: year,
          value: year,
        })),
      })),
    })),
  }));
  return facultyOptions;
};

export const getCurriGroupParam = (curriGroup: CurriGroup | undefined) => {
  return (
    curriGroup &&
    curriGroup.faculty.value &&
    curriGroup.department.value &&
    curriGroup.curriculum.value &&
    curriGroup.curriculumYear.value && {
      categoryFacultyId: curriGroup.faculty.value,
      categoryDepartmentId: curriGroup.department.value,
      categoryCurriculumId: curriGroup.curriculum.value,
      categoryCurriculumYear: curriGroup.curriculumYear.value,
    }
  );
};
