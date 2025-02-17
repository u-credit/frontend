'use client';

import React from 'react';
import { Typography, Box } from '@mui/material';

const Reports = () => {
  return (
    <div className="w-full">
      <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Mitr' }}>
        รายงาน
      </Typography>
      <Box sx={{ height: '70vh' }}></Box>
    </div>
  );
};

export default Reports;