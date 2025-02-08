import { SelectOption } from '@/types';

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
  semester: string | null;
  year: string | null;
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
