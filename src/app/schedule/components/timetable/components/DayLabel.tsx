import React from 'react';
import { Grid, Typography } from '@mui/material';

interface DayLabelProps {
  day: string;
  isLast: boolean;
}

const DayLabel: React.FC<DayLabelProps> = ({ day, isLast }) => (
  <Grid
    item
    xs={1}
    sx={{
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 'bold',
      minHeight: '80px',
      backgroundColor: '#FFF7E1',
      borderRight: '1px solid #D9D9D9',
      borderBottom: !isLast ? '1px solid #D9D9D9' : 'none',
      borderBottomLeftRadius: isLast ? '12px' : '0',
    }}
  >
    <Typography>{day}</Typography>
  </Grid>
);

export default DayLabel;