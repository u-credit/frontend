export interface BookmarkItem {
  subjectId: string;
  section?: string | null;
  semester: number;
  year: number;
  isShow?: boolean;
  category?: string | null;
  group?: string | null;
  subgroup?: string | null;
}

export interface BookmarkParam {
  subjectId?: string;
  section?: string | null;
  semester?: number;
  year?: number;
  isShow?: boolean;
  category?: string | null;
  group?: string | null;
  subgroup?: string | null;
}

export interface BookmarkDto {
  subject_id: string;
  subject_tname: string;
  subject_ename: string;
  credit: number;
  category?: number | null;
  group?: number | null;
  subgroup?: number | null;
  semester: string;
  year: string;
  section?: string | null;
  created_at?: string;
  updated_at?: string;
  is_show?: boolean;
}
