import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TinySubjectCard from './TinySubjectCard';
import CloseIcon from '@mui/icons-material/Close';
import TableChartIcon from '@mui/icons-material/TableChart';
import IconButton from '@mui/material/IconButton';

interface BookmarkModalProps {
  open: boolean;
  onClose: () => void;
}

export default function BookmarkModal({ open, onClose }: BookmarkModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="flex flex-col bg-white p-5 gap-y-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-[10px] max-w-4xl w-full">
        <div className="flex justify-between items-center">
          <span className="font-bold text-xl">วิชาที่บันทึกไว้</span>
          <div className="flex gap-x-5">
            <Button
              variant="contained"
              startIcon={<TableChartIcon />}
              sx={{ minWidth: '115px' }}
              // onClick={handleOpen}
            >
              จัดตารางเรียน
            </Button>
            <IconButton
              aria-label="delete"
              sx={{ padding: 0 }}
              size="large"
              onClick={onClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </div>
        </div>
        {/* <TinySubjectCard subjectDetail={undefined} /> */}
      </div>
    </Modal>
  );
}
