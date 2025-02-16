import { Add } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ModalAddCategory from './ModalAddCategory';
import CreateIcon from '@mui/icons-material/Create';
import { SubjectTranscriptDto } from '@/Interfaces/transcript.interface';

interface SubjectCardProps {
  subject: SubjectTranscriptDto;
}

export default function SubjectCard({ subject }: SubjectCardProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSubjectAddCategory, setSubjectAddCategory] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  useEffect(() => {
    setSubjectAddCategory(
      subject?.category !== null &&
        subject?.group !== null &&
        subject?.subgroup !== null,
    );
  }, [subject]);

  return (
    <>
      <div
        className={`rounded-lg border-[1px] p-4 ${isSubjectAddCategory ? 'border-primary-400' : 'border-gray-300'} min-h-28 w-full flex flex-col justify-between md:flex-row`}
      >
        <div className={`flex flex-col justify-between`}>
          <div id="row-1" className="flex flex-wrap gap-2 items-center">
            <div className="font-bold text-md md:text-lg">{subject.subject_id}</div>
            <div className="font-bold text-md md:text-lg text-wrap">{subject.subject_ename}</div>
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
        <div className="flex justify-end md:items-center min-w-40">
          <motion.div
            key={isSubjectAddCategory ? 'edit' : 'add'}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            {!isSubjectAddCategory ? (
              <Button
                security="small"
                variant="contained"
                startIcon={<Add />}
                onClick={handleOpenModal}
              >
                เพิ่มหมวดหมู่
              </Button>
            ) : (
              <Button
                size="small"
                variant="outlined"
                startIcon={<CreateIcon />}
                onClick={() => handleOpenModal()}
                sx={{
                  borderWidth: '2px',
                  borderColor: 'primary.400',
                  '&:hover': {
                    borderWidth: '2px',
                    borderColor: 'primary.400',
                  },
                }}
              >
                แก้ไขหมวดหมู่
              </Button>
            )}
          </motion.div>
          <ModalAddCategory
            open={isModalOpen}
            onClose={handleCloseModal}
            subject={subject}
            isSubjectAddCategory={isSubjectAddCategory}
          />
        </div>
      </div>
    </>
  );
}
