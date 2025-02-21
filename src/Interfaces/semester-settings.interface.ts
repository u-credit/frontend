export interface SemesterSetting {
  id: number;
  semester: number;
  year: number;
  is_active: boolean;
  created_at: string;
}

export interface YearRange {
  maxSemester: number;
  minSemester: number;
  minYear: number;
  maxYear: number;
  min: number;
  max: number;
}
