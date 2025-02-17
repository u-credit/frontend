import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from './Backdrop';

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-[100vh]">
      <CircularProgress size={100} />
      {/* <Backdrop open={true} onClose={() => {}} /> */}
    </div>
  );
}
