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
        className={`bg-white rounded-lg border-[1px] p-4 ${isSubjectAddCategory ? 'border-primary-400' : 'border-gray-300'} h-28`}
      >
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
            <motion.div
              key={isSubjectAddCategory ? 'edit' : 'add'}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              {!isSubjectAddCategory ? (
                <Button
                  size="medium"
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleOpenModal}
                  sx={{
                    height: '40px',
                    width: '150px',
                  }}
                >
                  เพิ่มหมวดหมู่
                </Button>
              ) : (
                <Button
                  size="medium"
                  variant="outlined"
                  startIcon={<CreateIcon />}
                  onClick={() => handleOpenModal()}
                  sx={{
                    height: '40px',
                    width: '150px',
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
      </div>
    </>
  );
}
