<<<<<<< HEAD
=======
import { CursorMetaDto, PageMetaDto } from './page.interface';

>>>>>>> 627568dbfc261d653c9b1935f2f78ff4d0ab664a
export type Response<T> = {
  status: boolean;
  statusCode: number;
  path: string;
  message: string;
  data: T;
  timestamp: string;
<<<<<<< HEAD
  meta?: any;
=======
  meta?: CursorMetaDto | PageMetaDto;
>>>>>>> 627568dbfc261d653c9b1935f2f78ff4d0ab664a
};
