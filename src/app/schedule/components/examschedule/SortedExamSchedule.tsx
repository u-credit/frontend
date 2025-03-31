import React from 'react';
import { BookmarkStateItem } from '@/features/bookmark/bookmarkSlice';
import ExamSchedule from './ExamScheduleBox';

interface SortedExamScheduleProps {
    scheduledItems: BookmarkStateItem[];
    examType: 'midterm' | 'final'; 
}

const SortedExamSchedule: React.FC<SortedExamScheduleProps> = ({
    scheduledItems,
    examType,
}) => {
    const sortedItems = scheduledItems
        .filter((item) => item.detail?.teach_table)
        .sort((a, b) => {
        const teachA = a.detail?.teach_table?.find(
            (t) => String(t.section) === String(a.section),
        );
        const teachB = b.detail?.teach_table?.find(
            (t) => String(t.section) === String(b.section),
        );

        const midtermA = teachA?.midterm_exam_date || null;
        const midtermB = teachB?.midterm_exam_date || null;
        const finalA = teachA?.final_exam_date || null;
        const finalB = teachB?.final_exam_date || null;

        const getDateValue = (date: string | Date | null | undefined): number => {
            if (!date) return Infinity;
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            return dateObj.getTime();
        };

        const getTimeValue = (time: string | null | undefined): number => {
            if (!time) return Infinity;
            const [hour, minute] = time.split(':').map(Number);
            if (isNaN(hour) || isNaN(minute)) return Infinity;
            return hour * 60 + minute;
        };

        const dateA = examType === 'midterm' ? midtermA : finalA;
        const dateB = examType === 'midterm' ? midtermB : finalB;
        const timeA = getTimeValue(
            examType === 'midterm'
            ? teachA?.midterm_exam_time_start
            : teachA?.final_exam_time_start,
        );
        const timeB = getTimeValue(
            examType === 'midterm'
            ? teachB?.midterm_exam_time_start
            : teachB?.final_exam_time_start,
        );

        if (!dateA && !dateB) return 0;
        if (!dateA && dateB) return 1;
        if (!dateB && dateA) return -1;

        if (getDateValue(dateA) !== getDateValue(dateB)) {
            return getDateValue(dateA) - getDateValue(dateB);
        }

        return timeA - timeB;
        });

    return (
        <>
        {sortedItems.map((item, index) => (
            <ExamSchedule
            key={index}
            item={item}
            selectedSection={String(item.section) || ''}
            examType={examType}
            />
        ))}
        </>
    );
};

export default SortedExamSchedule;
