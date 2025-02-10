import React from 'react';
import { Grid, Box } from '@mui/material';

interface HeaderRowProps {
  times: string[];
}

const HeaderRow: React.FC<HeaderRowProps> = ({ times }) => (
  <Grid container spacing={0}>
    <Grid item xs={1} sx={{ borderRight: '1px solid #D9D9D9' }} />
    {times.map((time, index) => (
      <Grid
        item
        xs={11 / times.length}
        key={time}
        sx={{
          borderRight: index !== times.length - 1 ? '1px solid #D9D9D9' : 'none',
          borderBottom: '1px solid #D9D9D9'
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold',
            minHeight: '40px',
            backgroundColor: '#FFF7E1',
          }}
          className={index === times.length - 1 ? "rounded-tr-xl" : ""}
        >
          {time}
        </Box>
      </Grid>
    ))}
  </Grid>
);

export default HeaderRow;