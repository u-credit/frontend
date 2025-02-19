import exp from 'constants';
import { SubjectDto } from './subject.interface';
import { SubjectProcessDto } from './transcript.interface';

export interface BookmarkItem extends BookmarkParam {
  subjectId: string;
}

export interface BookmarkParam {
  subjectId?: string;
  section?: string | null;
  semester?: number;
  year?: number;
  isShow?: boolean;
  category?: number | null;
  group?: number | null;
  subgroup?: number | null;
  childgroup?: number | null;
  withDetail?: boolean;
  facultyId?: string;
  curriculumId?: string;
  curriculumYear?: string;
}
export interface BookmarkDto {
  subject_id: string;
  subject_tname: string;
  subject_ename: string;
  credit: number;
  category?: number | null;
  group?: number | null;
  subgroup?: number | null;
  semester: number;
  year: number;
  section?: string | null;
  created_at?: string;
  updated_at?: string;
  is_show?: boolean;
}

export class CalculateBookmarkRequest {
  year?: number;
  semester?: number;
  isShow?: boolean;
  updateExistingCat?: boolean = false;
}

export class CalculateBookmarkBySubjectIdRequest {
  year?: number;
  semester?: number;
  subjectId?: string;
  isShow?: boolean;
}

export interface Bookmark {
  subject_id: string;
  semester: number;
  year: number;
  section: string | null;
  user_id: string;
  is_show: boolean;
  category: number | null;
  group: number | null;
  subgroup: number | null;
  childgroup: number | null;
  created_at: Date;
  updated_at: Date;
  subject: SubjectDto;
}