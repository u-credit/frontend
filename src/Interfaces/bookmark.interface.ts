export interface BookmarkItem {
  subjectId: string;
  selectedSection?: string;
  semester: number;
  year: number;
  is_show: boolean;
}

export interface BookmarkParam {
  subjectId?: string;
  selectedSection?: string;
  semester?: number;
  year?: number;
  isShow?: boolean;
  facultyId?: string;
  curriculumId?: string;
  curriculumYear: string;
}

export interface BookmarkDto {
  subject_id: string;
  subject_tname: string;
  subject_ename: string;
  credit: number;
  category?: number;
  group?: number;
  subgroup?: number;
  semester: string;
  year: string;
  section?: string;
  created_at?: string;
  updated_at?: string;
  is_show?: boolean;
}
