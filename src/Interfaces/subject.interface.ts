import { ListSubjectOrderBy, Order, SubjectCategoryEnum } from '@/enums';

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
  secondaryCursor?: string;
  //   offset?: number;
  direction?: Order;
  orderBy?: ListSubjectOrderBy;
  day?: number[];
  rangeTime?: string[];
  facultyId?: string;
  departmentId?: string;
  curriculumId?: string;
  categoryFacultyId?: string;
  categoryCurriculumId?: string;
  categoryCurriculumYear?: string;
  yearLevel?: number;
  subjectCategory?: SubjectCategoryEnum;
}

export interface ListSubjectByIdsQueryParams {
  semester?: number;
  year?: number;
  subjectIds: string[];
  categoryFacultyId?: string;
  categoryCurriculumId?: string;
  categoryCurriculumYear?: string;
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
  lecture_or_practice: string;
  section: string;
  room_no: string;
  room_name: string;
  building_no: string;
  building_name: string;
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

export interface CategoryDto {
  category_id: number;
  group_id: number;
  group_name: string;
  subgroup_name: string;
}

export interface SubjectDto {
  averageRating: number;
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
  categories?: CategoryDto[];
}

export interface CategoryItem {
  subjectId: string;
  category: number;
  categoryName: string;
  group: number;
  groupName: string;
  subgroup: number;
  subgroupName: string;
}

export interface SubjectCategory {
  subjectId: string;
  categories: CategoryItem[];
}

export interface TeachTableRequest {
  subjectId: string;
  section: string;
}

export interface CategoryFilter {
  category: number;
  group: number;
  subgroup: number;
  childgroup: number;
}

export interface DayOption {
  dayOfWeek: number;
  timeStart: string | null;
  timeEnd: string | null;
  timeRange: string | null;
}
export interface ExamOption {
  mexamDate: string | null;
  mexamStartTime: string | null;
  mexamEndTime: string | null;
  examDate: string | null;
  examStartTime: string | null;
  examEndTime: string | null;
}

export interface GetRecommendationRequest {
  teachTable: TeachTableRequest[];
  faculty: string;
  curriculum: string;
  curriculumYear: string;
  semester: number;
  year: number;
  categoryFilters?: CategoryFilter[];
}
