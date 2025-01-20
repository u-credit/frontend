import { Box, Button, Modal } from '@mui/material';
import React from 'react';

interface ModalAddCategoryProps {
  open: boolean;
  onClose: () => void;
}

export default function ModalAddCategory({
  open,
  onClose,
}: ModalAddCategoryProps) {
  return (
    <div>
      <Modal open={open} onClose={onClose}>
        <Box className="bg-white rounded-lg border-[1px] p-4 border-gray-300 flex flex-col gap-5">
          <div className="font-mitr font-medium text-xl">เพิ่มหมวดหมู่</div>
          <div className="bg-gray-100 rounded-lg flex flex-wrap gap-6 items-center h-12 px-4 border-[1px] border-gray-300">
            <div className="font-bold text-xl">01076011</div>
            <div className="font-bold text-xl">Operationg Systems</div>
          </div>
          <div className="font-mitr font-medium text-[18px]/[26px]">
            เลือกหมวดหมู่ของรายวิชานี้ *
          </div>
          <div>
            
          </div>
          <Button onClick={onClose} size="small" variant="contained">
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
