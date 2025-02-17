export interface UpdateUserRequest {
  username?: string;
  facultyId?: string;
  departmentId?: string;
  curriculumId?: string;
  curriculumYear?: string;
}

export interface UpdateUser {
  faculty_id?: string | null;
  department_id?: string | null;
  curr2_id?: string | null;
  curri_id?: string | null;
  curriculum_year?: string | null;
}

export interface User {
  id: string;
  username: string;
  email: string;
  roles: string;
  faculty_id: string | null;
  department_id: string | null;
  curr2_id: string | null;
  curri_id: string | null;
  curriculum_year: string | null;
}
