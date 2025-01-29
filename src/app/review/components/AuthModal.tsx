import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogin = () => {
    router.push('/auth');
    onClose();
  };

  return (
    <Dialog
      id="auth-modal"
      open={open}
      onClose={onClose}
      aria-labelledby="auth-modal-title"
      aria-describedby="auth-modal-description"
      PaperProps={{
        sx: {
          width: '100%',
          maxWidth: { xs: '90%', sm: '370px' },
          m: { xs: 2, sm: 'auto' },
          p: { xs: 1.5, sm: 2 },
        },
      }}
    >
      <DialogTitle
        id="auth-modal-title"
        sx={{
          fontFamily: 'Mitr',
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          pb: { xs: 0.5, sm: 1 },
          textAlign: 'center',
          px: { xs: 1, sm: 2 },
        }}
      >
        คุณยังไม่ได้เข้าสู่ระบบ
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 1, sm: 2 } }}>
        <Typography
          id="auth-modal-description"
          sx={{
            fontFamily: 'Bai Jamjuree',
            fontSize: { xs: '0.875rem', sm: '1rem' },
            color: 'text.secondary',
            textAlign: 'center',
            mt: 1,
          }}
        >
          คุณสามารถเขียนรีวิว
          และกดถูกใจของผู้อื่นได้เมื่อเข้าสู่ระบบแล้วเท่านั้น
        </Typography>
      </DialogContent>
      <DialogActions
        id="auth-modal-actions"
        sx={{
          px: { xs: 1, sm: 2 },
          pb: { xs: 1.5, sm: 2 },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 1, sm: 1 },
          justifyContent: 'center',
          '& > button': {
            width: { xs: '100%', sm: 'auto' },
          },
        }}
      >
        <Button
          id="auth-modal-cancel"
          onClick={onClose}
          variant="outlined"
          fullWidth={isMobile}
          sx={{
            minWidth: { xs: '100%', sm: '140px' },
            fontFamily: 'Bai Jamjuree',
            order: { xs: 2, sm: 1 },
          }}
        >
          ยกเลิก
        </Button>
        <Button
          id="auth-modal-login"
          onClick={handleLogin}
          variant="contained"
          fullWidth={isMobile}
          sx={{
            minWidth: { xs: '100%', sm: '140px' },
            fontFamily: 'Bai Jamjuree',
            order: { xs: 1, sm: 2 },
          }}
        >
          เข้าสู่ระบบ
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthModal;