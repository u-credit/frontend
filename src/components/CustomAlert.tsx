import React from 'react';
import { Alert, Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/features/store';
import { hideAlert } from '@/features/alertSlice';

const CustomAlert: React.FC = () => {
  const dispatch = useDispatch();
  const { message, severity, open } = useSelector(
    (state: RootState) => state.alert
  );

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={(_, reason) => reason !== 'clickaway' && dispatch(hideAlert())}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        severity={severity || 'info'}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => dispatch(hideAlert())}
            sx={{ 
              position: 'absolute',
              right: 8,
              top: 8,
              padding: '4px'
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        sx={{
          width: '100%',
          minWidth: '320px',
          boxShadow: 2,
          borderRadius: 2,
          position: 'relative',
          padding: '16px 24px',
          paddingRight: '40px',
          '& .MuiAlert-icon': {
            fontSize: '24px',
            alignItems: 'center',
            marginTop: '2px'
          },
          '& .MuiAlert-message': {
            padding: '4px 0'
          }
        }}
      >
        <div className="flex flex-col">
          <span className="font-semibold text-sm capitalize mb-1">
            {severity}
          </span>
          <span className="text-sm">
            {message}
          </span>
        </div>
      </Alert>
    </Snackbar>
  );
};

export default CustomAlert;