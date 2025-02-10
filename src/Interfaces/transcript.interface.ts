import { SelectOption } from "@/types";

export interface CategoryGroup {
    category: SelectOption
    group: SelectOption
    subgroup: SelectOption
    childgroup: SelectOption
}

export interface SubjectTranscriptDto {
    subject_id: string;
    subject_tname: string;
    subject_ename: string;
    credit: number;
    semester: string;
    year: string;
  }