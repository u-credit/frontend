import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  useTheme,
  useMediaQuery,
  Typography,
} from '@mui/material';

interface ChangeSemesterModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (year: number, semester: number) => void;
  yearRange: {
    minYear: number;
    maxYear: number;
    minSemester: number;
    maxSemester: number;
    min: number;
    max: number;
  };
}

export function ChangeSemesterModal({
  open,
  onClose,
  onSubmit,
  yearRange,
}: ChangeSemesterModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [newSetting, setNewSetting] = useState<{
    year: number | null;
    semester: number | null;
  }>({
    year: null,
    semester: null,
  });

  useEffect(() => {
    if (open && yearRange) {
      setNewSetting({
        year: yearRange.max,
        semester: yearRange.maxSemester,
      });
    }
  }, [open, yearRange]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        sx={{
          fontFamily: 'Mitr',
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          pb: { xs: 0.5, sm: 1 },
          textAlign: 'center',
          px: { xs: 1, sm: 2 },
        }}
      >
        เปลี่ยนภาคการศึกษา
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 1, sm: 2 } }}>
        <Typography
          sx={{
            fontFamily: 'Bai Jamjuree',
            fontSize: { xs: '0.875rem', sm: '1rem' },
            color: 'text.secondary',
            textAlign: 'center',
            mb: 3,
          }}
        >
          กรุณาเลือกปีการศึกษาและภาคการศึกษา
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <TextField
            label="ปีการศึกษา"
            type="number"
            value={newSetting.year || ''}
            onChange={(e) =>
              setNewSetting((prev) => ({
                ...prev,
                year: parseInt(e.target.value),
              }))
            }
            InputProps={{
              inputProps: {
                min: yearRange.min,
                max: yearRange.max,
              },
            }}
            sx={{
              '& .MuiInputLabel-root': {
                fontFamily: 'Bai Jamjuree',
              },
              '& .MuiInputBase-input': {
                fontFamily: 'Bai Jamjuree',
              },
            }}
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel sx={{ fontFamily: 'Bai Jamjuree' }}>
            ภาคการศึกษา
          </InputLabel>
          <Select
            value={newSetting.semester || ''}
            label="ภาคการศึกษา"
            onChange={(e) =>
              setNewSetting((prev) => ({
                ...prev,
                semester: e.target.value as number,
              }))
            }
            sx={{
              '& .MuiSelect-select': {
                fontFamily: 'Bai Jamjuree',
              },
            }}
          >
            {[1, 2, 3].map((sem) => (
              <MenuItem
                key={sem}
                value={sem}
                disabled={
                  (newSetting.year === yearRange.min &&
                    sem < yearRange.minSemester) ||
                  (newSetting.year === yearRange.max &&
                    sem > yearRange.maxSemester)
                }
                sx={{ fontFamily: 'Bai Jamjuree' }}
              >
                {sem}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions
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
          onClick={() => {
            if (newSetting.year && newSetting.semester) {
              onSubmit(newSetting.year, newSetting.semester);
            }
          }}
          variant="contained"
          fullWidth={isMobile}
          disabled={!newSetting.year || !newSetting.semester}
          sx={{
            minWidth: { xs: '100%', sm: '140px' },
            fontFamily: 'Bai Jamjuree',
            order: { xs: 1, sm: 2 },
          }}
        >
          ยืนยัน
        </Button>
      </DialogActions>
    </Dialog>
  );
}
