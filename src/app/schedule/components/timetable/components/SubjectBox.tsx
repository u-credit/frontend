import React from 'react';
import { Box, Typography } from '@mui/material';
import { ScheduleItem } from '../components/types';

interface SubjectBoxProps {
  item: ScheduleItem;
  left: number;
  width: number;
  color: string;
  hasConflict?: boolean;
  hasDay?:boolean;
}

const SubjectBox: React.FC<SubjectBoxProps> = ({ item, left, width, color , hasConflict , hasDay}) => (
  <Box
    sx={hasDay ?{
      position: 'absolute',
      left: `${left}%`,
      width: `${width}%`,
      backgroundColor: color,
      opacity:hasConflict ? '90%' : '100%',
      borderRadius: '5px',
      padding: '5px',
      height: '80px',
      overflow: 'hidden',
      zIndex: 1,
      border: hasConflict ? '2px solid #ff5070' : 'none',
    }:{
      backgroundColor: color,
      width: '200px',
      borderRadius: '5px',
      padding: '5px',
      height: '80px',
      overflow: 'hidden',
      zIndex: 1,
      margin:'10px 5px 10px 5px',

    }}
  >
    <div className="flex flex-col h-full justify-between">
      <div>
        <Typography
          fontWeight="bold"
          sx={{
            fontSize: '12px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {item.subject}
        </Typography>
        <Typography sx={{ fontSize: '12px' }}>{item.code}</Typography>
      </div>
      <div>
        <Typography sx={{ fontSize: '12px' }}>
          {item.section} | {item.room}
        </Typography>
      </div>
    </div>
  </Box>
);

export default SubjectBox;