import React, { useMemo } from 'react';
import { Box, Grid } from '@mui/material';
import HeaderRow from '../components/HeaderRow';
import DayLabel from '../components/DayLabel';
import TimeSlot from '../components/TimeSlotsRow';
import SubjectBox from '../components/SubjectBox';
import { generateDays } from '../utils/generateDays';
import { generateTimeRange } from '../utils/generateTimeRange';
import { ScheduleItem } from './types';
import { BookmarkStateItem } from '@/features/bookmark/bookmarkSlice';

export interface Table {
  teach_day: number;
  teach_time_start: string;
  teach_time_end: string;
  teach_time_str: string;
  section: string;
  room_name: string;
}

const COLORS = [
  '#ffcdd2',
  '#f8bbd0',
  '#ce93d8',
  '#bbdefb',
  '#d1c4e9',
  '#c5cae9',
  '#b2dfdb',
  '#fff59d',
  '#ffccbc',
  '#d7ccc8',
];

const thaiDayMap: { [key: number]: string } = {
  2: 'จ.',
  3: 'อ.',
  4: 'พ.',
  5: 'พฤ.',
  6: 'ศ.',
  7: 'ส.',
  1: 'อา.',
  0: 'ไม่ระบุ',
};

const convertToDecimalHour = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours + minutes / 60;
};

const transformSubjectsToSchedule = (
  subjects: BookmarkStateItem[],
  selectedSections: { subjectId: string; selectedSection: string }[],
): ScheduleItem[] => {
  const scheduleData: ScheduleItem[] = [];

  subjects?.forEach((subject) => {
    if (!subject.detail) return;
    const matchingSection = selectedSections.find(
      (section) => section.subjectId === subject.detail?.subject_id,
    );


    if (
      matchingSection &&
      subject.detail.teach_table &&
      Array.isArray(subject.detail.teach_table)
    ) {
      subject.detail.teach_table.forEach((table: Table) => {
        if(table.section === matchingSection.selectedSection){
          if (table.teach_day == 0){
            scheduleData.push({
              day: thaiDayMap[table.teach_day],
              timeStart: table.teach_time_start,
              timeEnd: table.teach_time_end,
              subject: subject.detail?.subject_english_name || '',
              code: subject.detail?.subject_id || '',
              section: `sec ${table.section}`,
              room: table.room_name,
            });
          }
          else {
            if (table.teach_time_start && table.teach_time_end) {
              scheduleData.push({
                day: thaiDayMap[table.teach_day],
                timeStart: table.teach_time_start,
                timeEnd: table.teach_time_end,
                subject: subject.detail?.subject_english_name || '',
                code: subject.detail?.subject_id || '',
                section: `sec ${table.section}`,
                room: table.room_name,
              });
            }
  
            if (table.teach_time_str) {
              const match = table.teach_time_str.match(
                /^(\d)x(\d{2}:\d{2})-(\d{2}:\d{2})$/,
              );
              if (match) {
                const [, day, timeStart, timeEnd] = match;
                
                scheduleData.push({
                  day: thaiDayMap[parseInt(day)],
                  timeStart,
                  timeEnd,
                  subject: subject.detail?.subject_english_name || '',
                  code: subject.detail?.subject_id || '',
                  section: `sec ${table.section}`,
                  room: table.room_name,
                });
              }
            }
          }
        }
        
      });
    }
  });

  return scheduleData;
};

interface TimetableProps {
  subjects: BookmarkStateItem[];
  section: any[];
}

const Timetable: React.FC<TimetableProps> = ({ subjects, section }) => {
  const scheduleData: ScheduleItem[] = useMemo(
    () => transformSubjectsToSchedule(subjects, section),
    [subjects, section],
  );

  const times = useMemo(() => generateTimeRange(scheduleData), [scheduleData]);
  const days = useMemo(() => generateDays(scheduleData), [scheduleData]);

  const conflictingSubjects = useMemo(() => {
    const conflicts = new Set<string>();

    for (let i = 0; i < scheduleData.length; i++) {
      for (let j = i + 1; j < scheduleData.length; j++) {
        const schedule1 = scheduleData[i];
        const schedule2 = scheduleData[j];

        if (schedule1.day === schedule2.day) {
          const start1 = convertToDecimalHour(schedule1.timeStart);
          const end1 = convertToDecimalHour(schedule1.timeEnd);
          const start2 = convertToDecimalHour(schedule2.timeStart);
          const end2 = convertToDecimalHour(schedule2.timeEnd);

          if (
            (start1 <= start2 && end1 > start2) ||
            (start2 <= start1 && end2 > start1)
          ) {
            conflicts.add(`${schedule1.code}-${schedule1.section}`);
            conflicts.add(`${schedule2.code}-${schedule2.section}`);
          }
        }
      }
    }
    return conflicts;
  }, [scheduleData]);

  const codeColors = useMemo(() => {
    const colors = new Map<string, string>();
    scheduleData.forEach((item) => {
      if (!colors.has(item.code)) {
        colors.set(item.code, COLORS[colors.size % COLORS.length]);
      }
    });
    return colors;
  }, [scheduleData]);


  console.log(scheduleData)
  return (
    <Box sx={{ border: '1px solid #BB4100' }} className="rounded-xl">
      <HeaderRow times={times} />
      {days.map((day, dayIndex) => (
        <Grid container key={day}>
          <DayLabel day={day} isLast={dayIndex === days.length-1} />
          <Grid item xs={11} sx={{ position: 'relative', display: 'flex' }}>
            {times.map((time, timeIndex) => (
              <TimeSlot
                key={`${day}-${time}`}
                day={day}
                time={time}
                index={timeIndex}
                totalTimes={times.length}
                hasBorder={timeIndex !== times.length - 1}
                isLastRow={dayIndex === days.length - 1}
              />
            ))}
            {scheduleData
              .filter((item) => item.day === day)
              .map((item, index) => {
                const startHour = convertToDecimalHour(item.timeStart);
                const endHour = convertToDecimalHour(item.timeEnd);
                const timePerSlot = 1;
                const left =
                  ((startHour - parseInt(times[0])) / timePerSlot) *
                  (100 / times.length);
                const width =
                  ((endHour - startHour) / timePerSlot) * (100 / times.length);
                const color = codeColors.get(item.code) || COLORS[0];
                const hasConflict = conflictingSubjects.has(
                  `${item.code}-${item.section}`,
                );

                return (
                  <SubjectBox
                    key={index}
                    item={item}
                    left={left}
                    width={width}
                    color={color}
                    hasConflict={hasConflict}
                    hasDay={day != 'ไม่ระบุ'}
                  />
                );
              })}
          </Grid>
        </Grid>
      ))}
    </Box>
  );
};

export default Timetable;
