import { ScheduleItem } from '../components/types';

export const generateDays = (data: ScheduleItem[]) => {
  const allDays = ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."];
  const lastDayIndex = Math.max(
    ...data.map(item => allDays.indexOf(item.day)),
    allDays.indexOf("ศ.")
  );
  return allDays.slice(0, lastDayIndex + 1);
};