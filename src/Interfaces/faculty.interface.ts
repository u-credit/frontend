<<<<<<< HEAD
=======
import { SelectOption } from '@/types';

>>>>>>> 627568dbfc261d653c9b1935f2f78ff4d0ab664a
export interface CurriculumDto {
  curriculum_id: string;
  curriculum_name: string;
  curriculum_ename: string;
  curriculum_year: string[];
}

export interface DepartmentDto {
  department_id: string;
  department_name: string;
  department_ename: string;
  curriculum: CurriculumDto[];
}

export interface FacultyDto {
  faculty_id: string;
  prefix_name_th: string;
  prefix_name_en: string;
  faculty_name: string;
  faculty_ename: string;
  department: DepartmentDto[];
}

export interface CurriGroup {
<<<<<<< HEAD
  faculty: string | number;
  department: string | number;
  curriculum: string | number;
  curriculumYear: string | number;
}
=======
  faculty: SelectOption;
  department: SelectOption;
  curriculum: SelectOption;
  curriculumYear: SelectOption;
}
>>>>>>> 627568dbfc261d653c9b1935f2f78ff4d0ab664a
