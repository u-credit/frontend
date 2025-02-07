import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import ModalAddCategory from './ModalAddCategory';
import {
  CategoryGroup,
  SubjectTranscriptDto,
} from '@/Interfaces/transcript.interface';

interface SubjectCardProps {
  subject: SubjectTranscriptDto;
}

export default function SubjectCard({
  subject,
}: SubjectCardProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <div>
      <div className="bg-white rounded-lg border-[1px] p-4 border-gray-300 h-28">
        <div className="flex justify-between w-full h-full">
          <div className="flex flex-col justify-between">
            <div id="row-1" className="flex flex-wrap gap-2 items-center">
              <div className="font-bold text-md">{subject.subject_id}</div>
              <div className="font-bold text-md">{subject.subject_ename}</div>
              {subject.year && subject.semester ? (
                <div>
                  ปี {subject.year} เทอม {subject.semester}
                </div>
              ) : null}
            </div>
            <div id="row-2" className="flex flex-wrap gap-2 items-center">
              <div>{subject.credit} หน่วยกิต</div>
            </div>
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
            <ModalAddCategory
              open={isModalOpen}
              onClose={handleCloseModal}
              subject={subject}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
