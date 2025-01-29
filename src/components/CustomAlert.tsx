import React from 'react';
import { Alert, AlertTitle, Snackbar } from '@mui/material';

interface CustomAlertProps {
  open: boolean;
  message: string;
  severity?: 'error' | 'warning' | 'info' | 'success';
  onClose: () => void;
  duration?: number;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  open,
  message,
  severity = 'error',
  onClose,
  duration = 3000,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: '100%',
          boxShadow: 2,
          borderRadius: 2,
          fontSize: '16px',
          '& .MuiAlert-icon': {
            fontSize: '24px',
          },
        }}
      >
        <AlertTitle
          sx={{
            fontSize: '18px',
            fontFamily: 'Rubik, sans-serif',
            fontWeight: '600',
          }}
        >
          {severity === 'error' ? 'Error' : 'Success'}
        </AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomAlert;
