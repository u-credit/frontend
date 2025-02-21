import { SelectOption } from '@/types';
import { CategoryItem } from './subject.interface';

export interface CategoryGroup {
  category: SelectOption;
  group: SelectOption;
  subgroup: SelectOption;
  childgroup: SelectOption;
}

export interface SubjectTranscriptDto {
  subject_id: string;
  subject_tname: string;
  subject_ename: string;
  category?: number;
  group?: number;
  subgroup?: number;
  childgroup?: number;
  credit: number;
  semester: number | null;
  year: number | null;
  categories: CategoryItem[];
}

export interface RequiredCreditDto {
  category: number;
  group: number;
  subgroup: number;
  credit1: number;
  credit2: number;
  c_cat_name: string;
  c_group_name: string;
  c_subgroup_name: string;
}

export interface CurriculumGroupParams {
  faculty: string;
  department: string;
  curriculum: string;
  curriculumYear: string;
}

export interface SubjectProcessDto {
  subject_id: string;
  subject_tname: string;
  subject_ename: string;
  credit: number;
  category: number;
  group: number;
  subgroup: number;
  childgroup?: number;
  semester: string;
  year: string;
  categories: CategoryItem[];
}

export interface CreateTranscriptResponse {
  user: {
    faculty_id: string;
    department_id: string;
    curr2_id: string;
    curri_id: string;
    curriculum_year: string;
  };
}

export interface CategoryProcessDto {
  category: number;
  group: number;
  subgroup: number;
  credit1: number;
  credit2: number;
  c_cat_name: string;
  c_group_name: string;
  c_subgroup_name: string;
  earn_credit: number;
  subjects: SubjectProcessDto[];
}

export interface GetTranscriptResponse extends CalculatedGroupedSubjectDto {
  subjects: SubjectProcessDto[];
}

export interface CalculatedGroupedSubjectDto {
  groups: CategoryProcessDto[];
  unmatched: SubjectProcessDto[];
}

export interface CalculatedSubjectDto {
  groups: CategoryProcessDto[];
  matched: SubjectProcessDto[];
  unmatched: SubjectProcessDto[];
  custom: SubjectProcessDto[];
}

export interface UpdateRecalculateDto {
  subjectId: string;
  semester?: number;
  year?: number;
  category: number | null;
  group: number | null;
  subgroup: number | null;
  childgroup: number | null;
}
