import React from 'react';
import { Box } from '@mui/material';

interface TimeSlotProps {
  day: string;
  time: string;
  index: number;
  totalTimes: number;
  hasBorder: boolean;
  isLastRow: boolean;
}

const TimeSlot: React.FC<TimeSlotProps> = ({
  day,
  time,
  index,
  totalTimes,
  hasBorder,
  isLastRow,
}) => (
  <Box
    sx={day !== 'ไม่ระบุ' ?{
      width: `${100 / totalTimes}%`,
      borderRight: hasBorder ? '1px solid #D9D9D9' : 'none',
      minHeight: '80px',
      borderBottom: isLastRow ? 'none' : '1px solid #D9D9D9',
    }: {}}
    key={`${day}-${time}`}
  />
);

export default TimeSlot;

