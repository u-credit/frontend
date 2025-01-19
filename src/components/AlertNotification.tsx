import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import { hideAlert } from '@/features/alertSlice';
import { RootState } from '@/features/store';

const AlertNotification = () => {
  const dispatch = useDispatch();
  const { message, severity, open } = useSelector(
    (state: RootState) => state.alert,
  );

  const handleClose = (_: any, reason?: string) => {
    if (reason === 'clickaway') return;
    dispatch(hideAlert());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={severity || 'info'}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertNotification;
