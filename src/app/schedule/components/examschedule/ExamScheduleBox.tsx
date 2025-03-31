import React from 'react';
import { Typography } from '@mui/material';
import { BookmarkStateItem } from '@/features/bookmark/bookmarkSlice';
import { TeachTableDto } from '@/Interfaces';

interface ExamScheduleProps {
  item: BookmarkStateItem;
  selectedSection: string;
  examType: 'midterm' | 'final';
}

const ExamSchedule: React.FC<ExamScheduleProps> = ({
  item,
  selectedSection,
  examType,
}) => {
  if (!item || !item.detail) {
    return <Typography>ไม่พบข้อมูลวิชา</Typography>;
  }

  const { detail } = item;
  const teachTableForSelectedSection = detail?.teach_table?.find(
    (teachTable: TeachTableDto) =>
      String(teachTable.section) === selectedSection,
  );

  if (!teachTableForSelectedSection) return null;

  const {
    midterm_exam_date,
    midterm_exam_time_start,
    midterm_exam_time_end,
    final_exam_date,
    final_exam_time_start,
    final_exam_time_end,
  } = teachTableForSelectedSection;

  const formatDateToThai = (dateString: string | Date | null): string => {
    if (!dateString) return 'จัดสอบเอง';
    const date =
      typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('th-TH', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (timeString: string | null): string => {
    if (!timeString) return '';
    const [hour, minute] = timeString.split(':');
    return minute === '00' ? hour : `${hour}:${minute}`;
  };

  const examDate = examType === 'midterm' ? midterm_exam_date : final_exam_date;
  const examStartTime =
    examType === 'midterm' ? midterm_exam_time_start : final_exam_time_start;
  const examEndTime =
    examType === 'midterm' ? midterm_exam_time_end : final_exam_time_end;

  return (
    <div className="flex gap-x-4 m-1">
      <div
        className={`w-full border rounded-lg p-4 min-h-[125px] ${examType === 'midterm' ? 'bg-blue-100' : 'bg-red-100'}`}
      >
        <Typography fontWeight="bold" fontSize="14px">
          {item.subjectId} {item.detail?.subject_english_name}
        </Typography>
        <Typography>{formatDateToThai(examDate)}</Typography>
        {examDate && (
          <Typography>
            {`${formatTime(examStartTime)} - ${formatTime(examEndTime)}`}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default ExamSchedule;
