import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import React, { useState } from 'react';
import ModalAddCategory from './ModalAddCategory';

export default function SubjectCard() {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <div>
      <div className="bg-white rounded-lg border-[1px] p-4 border-gray-300 h-28">
        <div className="flex justify-between w-full h-full">
          <div className="flex flex-col justify-between">
            <div className="flex flex-wrap gap-6 items-center">
              <div className="font-bold text-xl">01076011</div>
              <div className="font-bold text-xl">Operationg Systems</div>
            </div>
            <div>3 หน่วยกิต</div>
          </div>
          <div className="flex items-center">
            <Button
              size="medium"
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenModal}
            >
              เพิ่มหมวดหมู่
            </Button>
            <ModalAddCategory open={isModalOpen} onClose={handleCloseModal} />
          </div>
        </div>
      </div>
    </div>
  );
}
