import * as React from 'react';
import Button from '@mui/material/Button';

interface AddBookmarkModalProps {
  open: boolean;
  onClose: (add: boolean) => void;
}

export default function AddBookmarkModal({
  open,
  onClose,
}: AddBookmarkModalProps) {
  React.useEffect(() => {
    if (!localStorage.getItem('bookmark')) {
      onClose(false);
    }
  }, [onClose]);
  return (
    <div className="z-50 flex flex-col bg-white absolute top-[52%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 gap-y-2 rounded-[10px] items-center">
      <span className="font-bold text-xl">บันทึกรายวิชาที่เคยบันทึกไว้</span>
      <div className="flex gap-x-3">
        <Button
          variant="contained"
          sx={{ minWidth: '115px' }}
          onClick={() => onClose(false)}
          color="error"
        >
          ไม่
        </Button>
        <Button
          variant="contained"
          sx={{ minWidth: '115px' }}
          onClick={() => onClose(true)}
          color="success"
        >
          ใช่
        </Button>
      </div>
    </div>
  );
}
