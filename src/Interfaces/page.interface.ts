<<<<<<< HEAD
export interface PageDto<T> {
  data: T[];
  meta: PageMetaDto;
}

=======
>>>>>>> 627568dbfc261d653c9b1935f2f78ff4d0ab664a
export interface PageMetaDto {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
<<<<<<< HEAD
=======

export interface CursorMetaDto {
  cursor: string | null;
  limit: number;
  currentItems: number;
  totalItems: number;
  hasNext: boolean;
}
>>>>>>> 627568dbfc261d653c9b1935f2f78ff4d0ab664a
