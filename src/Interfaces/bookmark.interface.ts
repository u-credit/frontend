import { Order } from '@/enums';

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

export interface CalculateBookmarkQueryParams {
  semester: number;
  year: number;
  orderBy?: Order;
  isShow?: boolean;
}
