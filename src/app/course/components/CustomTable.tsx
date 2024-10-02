import { TeachTableDto } from '@/Interfaces';
import {
  formatDate,
  formatShortThaiDay,
  formatTeachTime,
  formatTeachTimeStr,
  formatThaiDay,
} from '@/utils';
interface CustomTableProps {
  teachTable: TeachTableDto[];
}
export default function CustomTable({ teachTable }: CustomTableProps) {
  const columns = [
    'sec',
    'วันเวลา',
    'อาคารเรียน',
    'ผู้สอน',
    'สอบกลางภาค',
    'สอบปลายภาค',
  ];
  return (
    <div
      id="CustomTable"
      className="table w-full border-[1px] border-gray-200 rounded-[8px] relative mt-4 overflow-visible py-2 "
    >
      <div className="table-header-group border-collapse divide-x divide-gray-200 overflow-x-scroll  -translate-y-[20px] ">
        <div className="table-row text-center ">
          {columns.map((column, index) => (
            <div key={index} className="table-cell text-center">
              <span className="bg-white px-2 group-hover:bg-gray-50">
                {column}
              </span>
            </div>
          ))}
        </div>
      </div>
      {teachTable.map((teach) => (
        <div
          key={teach.teach_table_id}
          className="table-row-group -translate-y-[8px]"
        >
          <div className="table-row text-center">
            <div className="table-cell border-r border-gray-200">
              {teach.section}
            </div>
            <div className="table-cell border-r border-gray-200...">
              {formatShortThaiDay(teach.teach_day)}{' '}
              {formatTeachTime(teach.teach_time_start, teach.teach_time_end)}
              {teach.teach_time_str
                ? ` + ${formatTeachTimeStr(teach.teach_time_str)}`
                : ''}
            </div>
            <div className="table-cell border-r border-gray-200">
              {teach.building_no} {teach.room_no}
            </div>
            <div className="table-cell border-r border-gray-200">
              {teach.teacher[0]?.teacher_prename}{' '}
              {teach.teacher[0]?.teacher_thai_fullname}
            </div>
            <div className="table-cell border-r border-gray-200">
              {formatThaiDay(teach.midterm_exam_day)}{' '}
              {formatDate(teach.midterm_exam_date)}
            </div>
            <div className="table-cell border-r ">
              {formatThaiDay(teach.final_exam_day)}{' '}
              {formatDate(teach.final_exam_date)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
