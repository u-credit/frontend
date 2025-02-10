export interface BookmarkItem {
  subjectId: string;
  selectedSection?: string;
  semester: number;
  year: number;
}
export interface BookmarkParam {
  subjectId?: string;
  selectedSection?: string;
  semester: number;
  year: number;
}

export interface BookmarkDto {
  subject_id: string;
  semester: number;
  year: number;
  section: string;
  created_at: string;
  updated_at: string;
}
