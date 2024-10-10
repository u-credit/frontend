import { ListSubjectOrderBy, Order } from '@/enums';

export interface SubjectDetail {
  subjectCode: string;
  subjectName: string;
  subjectCategory: string;
  subjectCredit: number;
  subjectSection: SectionDetail[];
}

export interface SectionDetail {
  sectionNumber: string;
  sectionTime: string;
  sectionRoom: string;
  sectionInstructor: string;
}

export interface ListSubjectQueryParams {
  semester: number;
  year: number;
  keyword?: string;
  isBookmarked?: boolean;
  limit?: number;
  cursor?: string;
  //   offset?: number;
  direction?: Order;
  orderBy?: ListSubjectOrderBy;
}

export interface TeacherDto {
  teacher_id: string;
  teacher_prename: string;
  teacher_thai_fullname: string;
}
export interface TeachTableDto {
  teach_table_id: number;
  curriculum_id: number;
  semester: number;
  year: number;
  section: string;
  room_no: string;
  building_no: string;
  teach_day: number;
  teach_time_start: string;
  teach_time_end: string;
  midterm_exam_day: number;
  midterm_exam_date: Date | null;
  midterm_exam_time_start: string;
  midterm_exam_time_end: string;
  final_exam_day: number;
  final_exam_date: Date | null;
  final_exam_time_start: string;
  final_exam_time_end: string;
  teach_time_str: string;
  remark: string;
  lastupdate: Date;
  teacher: TeacherDto[];
}

export interface SubjectDto {
  subject_id: string;
  subject_thai_name: string;
  subject_english_name: string;
  credit: number;
  lecture_hour: number;
  practice_hour: number;
  detail?: string;
  self_hour: number;
  precondition?: number;
  status: string;
  subject_type: string;
  last_modified: Date;
  prerequisite?: string[];
  teach_table: TeachTableDto[];
}
