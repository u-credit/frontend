import { CursorMetaDto, PageMetaDto } from './page.interface';

export type Response<T> = {
  status: boolean;
  statusCode: number;
  path: string;
  message: string;
  data: T;
  timestamp: string;
  meta?: CursorMetaDto | PageMetaDto;
};
