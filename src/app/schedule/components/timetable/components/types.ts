export interface ScheduleItem {
  day: string;
  timeStart: string;
  timeEnd: string;
  subject: string;
  code: string;
  section: string;
  room: string;
}

export interface SubjectDto {
  subject_id: string;
  subject_thai_name: string;
  subject_english_name: string;
  credit: number;
  lecture_hour: number;
  practice_hour: number;
  teach_table: TeachTableDto[];
}

export interface TeachTableDto {
  section: string;
  teach_day: number;
  teach_time_start: string;
  teach_time_end: string;
  room_name: string;
}

export interface ScheduleItem {
  day: string;
  timeStart: string;
  timeEnd: string;
  subject: string;
  code: string;
  section: string;
  room: string;
  isShow?: boolean;
}