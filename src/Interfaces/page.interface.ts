export interface PageMetaDto {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CursorMetaDto {
  cursor: string | null;
  limit: number;
  currentItems: number;
  totalItems: number;
  hasNext: boolean;
}
