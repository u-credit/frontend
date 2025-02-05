import { ScheduleItem } from '../components/types';

export const generateTimeRange = (data: ScheduleItem[]) => {
  let minTime = 8;
  let maxTime = 16;

  data.forEach((item) => {
    const startTime = parseInt(item.timeStart.split(":")[0]);
    const endTime = parseInt(item.timeEnd.split(":")[0]);
    minTime = Math.min(minTime, startTime);
    maxTime = Math.max(maxTime, endTime);
  });

  const times: string[] = [];
  for (let i = minTime; i <= maxTime; i++) {
    times.push(i.toString());
  }
  return times;
};
