import { TeachTableDto } from '@/Interfaces';
import {
  formatDate,
  formatShortThaiDay,
  formatTeachTime,
  formatTeachTimeStr,
  formatThaiDay,
} from '@/utils';
import { useEffect } from 'react';
interface CustomTableProps {
  teachTable: TeachTableDto[];
}
export default function CustomTable({ teachTable }: CustomTableProps) {
  const columns = [
    'sec',
    'ท/ป',
    'วันเวลา',
    'อาคารเรียน',
    'ผู้สอน',
    'สอบกลางภาค',
    'สอบปลายภาค',
  ];

  useEffect;

  return (
    <div className="overflow-x-auto">
      <div
        id="CustomTable"
        className="table w-full border-[1px] border-gray-200 rounded-[8px] relative mt-4 py-2 min-w-[700px]"
      >
        <div className="table-header-group border-collapse divide-x divide-gray-200 -translate-y-[20px] ">
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
        {teachTable.map((teach, index) => (
          <div
            key={index}
            className={`text-sm table-row-group -translate-y-[8px]`} // ${index % 2 === 0 ? 'bg-gray-100' : ''}
          >
            <div className="table-row text-center">
              <div
                className={`table-cell align-middle border-r py-2 border-gray-200 ${index !== teachTable.length - 1 ? 'border-b' : ''} `}
              >
                {teach.section}
              </div>
              <div
                className={`table-cell align-middle border-r py-2 border-gray-200 ${index !== teachTable.length - 1 ? 'border-b' : ''} `}
              >
                {teach.lecture_or_practice}
              </div>
              <div
                className={`table-cell align-middle border-r border-gray-200 ${index !== teachTable.length - 1 ? 'border-b' : ''} `}
                style={{ whiteSpace: 'pre-line' }}
              >
                {formatShortThaiDay(teach.teach_day)}{' '}
                {formatTeachTime(teach.teach_time_start, teach.teach_time_end)}
                {teach.teach_time_str
                  ? `\n+ ${formatTeachTimeStr(teach.teach_time_str)}`
                  : ''}
              </div>
              <div
                className={`table-cell align-middle border-r border-gray-200 ${index !== teachTable.length - 1 ? 'border-b' : ''} `}
              >
                {teach.building_name} {teach.room_name}
              </div>
              <div
                className={`table-cell align-middle border-r border-gray-200 ${index !== teachTable.length - 1 ? 'border-b' : ''} `}
              >
                {teach.teacher.map((teacher, index) => (
                  <div key={index}>
                    {teacher.teacher_prename} {teacher.teacher_thai_fullname}
                  </div>
                ))}
              </div>
              <div
                className={`table-cell align-middle border-r border-gray-200 ${index !== teachTable.length - 1 ? 'border-b' : ''} `}
              >
                {formatThaiDay(teach.midterm_exam_day)}{' '}
                {formatDate(teach.midterm_exam_date)}
              </div>
              <div
                className={`table-cell align-middle ${index !== teachTable.length - 1 ? 'border-b' : ''} `}
              >
                {formatThaiDay(teach.final_exam_day)}{' '}
                {formatDate(teach.final_exam_date)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
