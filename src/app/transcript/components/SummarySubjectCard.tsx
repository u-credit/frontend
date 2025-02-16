'use client';
import { Button, Chip, Tooltip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import CreateIcon from '@mui/icons-material/Create';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Backdrop from './Backdrop';
import ModalAddCategory from './ModalAddCategory';
import { useTranscriptContext } from '@/app/contexts/TranscriptContext';
import { SubjectTranscriptDto } from '@/Interfaces/transcript.interface';
import { CategoryDto } from '@/Interfaces';
import { chipCategory } from '@/utils';

export interface SummarySubject extends SubjectTranscriptDto {
  categories: any;
}
interface SummarySubjectCardProps {
  subject: SummarySubject;
}
export default function SummarySubjectCard({
  subject,
}: SummarySubjectCardProps) {
  useTranscriptContext();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleReview = (): void => {
    router.push(`/course/${subject.subject_id}`);
  };
  const handleEditCategory = (): void => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    document.documentElement.style.overflowY = 'auto';
  };

  useEffect(() => {
    if (isModalOpen) {
      document.documentElement.style.overflowY = 'hidden';
    }
  }, [isModalOpen]);

  return (
    <>
      <div className="flex flex-col mobile:flex-row justify-between border-[1px] border-gray-300 rounded-lg">
        <div className="flex flex-col gap-y-2 p-4">
          <div
            id="row1"
            className="flex flex-wrap flex-row gap-4 items-center "
          >
            <div className="font-rubik font-medium text-md md:text-lg">
              {subject.subject_id}
            </div>
            <div className="font-rubik font-medium text-md md:text-lg">
              {subject.subject_ename}
            </div>
            {subject.categories &&
              subject.categories.map((category: CategoryDto) => (
                <Tooltip
                  title={chipCategory(category)}
                  key={
                    category.category_id +
                    category.group_name +
                    category.subgroup_name
                  }
                >
                  <Chip
                    label={chipCategory(category)}
                    size="small"
                    variant="outlined"
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: {
                        xs: '200px',
                        sm: '500px',
                      },
                    }}
                  />
                </Tooltip>
              ))}
            <div className="self-center">
              ปี {subject.year} เทอม {subject.semester}
            </div>
          </div>
          <div id="row2" className="flex flex-row gap-4 ">
            <h4>{subject.credit} หน่วยกิต</h4>
          </div>
        </div>
        <div
          id="button-area"
          className="flex flex-col pb-4 mobile:pb-0 justify-center gap-y-1 px-4 text-nowrap"
        >
          <Button
            size="small"
            variant="outlined"
            startIcon={<CreateIcon />}
            onClick={() => handleEditCategory()}
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
          <Button
            size="small"
            variant="contained"
            startIcon={<StarIcon />}
            onClick={() => handleReview()}
          >
            รีวิว
          </Button>
        </div>
      </div>
      <Backdrop open={isModalOpen} onClose={handleCloseModal} />
      <ModalAddCategory
        open={isModalOpen}
        onClose={handleCloseModal}
        subject={subject}
      />
    </>
  );
}
