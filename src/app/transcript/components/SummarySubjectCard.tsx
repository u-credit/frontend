'use client';
import { Button, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import CreateIcon from '@mui/icons-material/Create';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import EditCategoryModal from './EditCategoryModal';
import Backdrop from './Backdrop';
import ModalAddCategory from './ModalAddCategory';
import { useTranscriptContext } from '@/app/contexts/TranscriptContext';
import { initSelectOption } from '@/types';
import { CategoryGroup } from '@/Interfaces/transcript.interface';
interface SummarySubjectCardProps {
  subjectDetail: any;
}
export default function SummarySubjectCard({
  subjectDetail,
}: SummarySubjectCardProps) {
  const { categoryOptions, selectedCurriGroup, setSelectedCurriGroup } =
    useTranscriptContext();

  const [selectedCategory, setSelectedCategory] = useState<CategoryGroup>({
    category: initSelectOption(),
    group: initSelectOption(),
    subgroup: initSelectOption(),
    childgroup: initSelectOption(),
  });
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleReview = (): void => {
    router.push(`/course/${subjectDetail.subject_id}`);
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
            <div className="font-rubik font-medium text-lg">
              {subjectDetail.subject_id}
            </div>
            <div className="font-rubik font-medium text-lg">
              {subjectDetail.subject_ename}
            </div>
            <Chip
              // key={category.category_id}
              // label={`${category.group_name} + ${category.subgroup_name}`}
              label="หมวด"
              size="small"
              variant="outlined"
              sx={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                '@media (max-width: 600px)': {
                  maxWidth: '250px',
                },
              }}
            />
            <div className="self-center">
              ปี {subjectDetail.year} เทอม {subjectDetail.semester}
            </div>
          </div>
          <div id="row2" className="flex flex-row gap-4 ">
            <h4>{subjectDetail.credit} หน่วยกิต</h4>
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
        subject={subjectDetail}
      />
    </>
  );
}
