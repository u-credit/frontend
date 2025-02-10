import { Box, Button, IconButton, Modal } from '@mui/material';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import CategorySelectGroup from './CategorySelectGroup';
import {
  CategoryGroup,
  SubjectTranscriptDto,
} from '@/Interfaces/transcript.interface';
import { initSelectOption, SelectOption } from '@/types';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

interface ModalAddCategoryProps {
  open: boolean;
  selectedCategory: CategoryGroup;
  setSelectCategory: Dispatch<SetStateAction<CategoryGroup>>;
  categoryOptions: SelectOption[];
  subjectDetail: SubjectTranscriptDto;
  onClose: () => void;
}

export default function ModalAddCategory({
  open,
  onClose,
  selectedCategory,
  setSelectCategory,
  categoryOptions,
  subjectDetail,
}: ModalAddCategoryProps) {
  const [isEnableSave, setIsEnableSave] = useState(false);

  useEffect(() => {
    if (selectedCategory.category.value) {
      if (selectedCategory.category.children?.length === 0) {
        setIsEnableSave(true);
        return;
      } else {
        if (selectedCategory.group.value) {
          if (selectedCategory.group?.children?.length === 0) {
            setIsEnableSave(true);
            return;
          } else {
            if (selectedCategory.subgroup.value) {
              if (
                selectedCategory.subgroup.children?.length === 0 ||
                selectedCategory.subgroup?.children == undefined
              ) {
                setIsEnableSave(true);
                return;
              } else {
                if (selectedCategory.childgroup.value) {
                  setIsEnableSave(true);
                  return;
                } else {
                  setIsEnableSave(false);
                  return;
                }
              }
            }
          }
        }
      }
    }
    setIsEnableSave(false);
  }, [selectedCategory]);

  const handleClose = () => {
    setSelectCategory({
      category: initSelectOption(),
      group: initSelectOption(),
      subgroup: initSelectOption(),
      childgroup: initSelectOption(),
    });
    onClose();
  };

  return (
    <div>
      <Modal open={open} onClose={onClose}>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Box className="bg-white rounded-lg border-[1px] p-4 border-gray-300 flex flex-col gap-5 w-full max-w-5xl">
            <div className="flex justify-between w-full h-full">
              <div className="font-mitr font-medium text-2xl">
                เพิ่มหมวดหมู่
              </div>
              <IconButton onClick={handleClose}>
                <CloseIcon fontSize="large" />
              </IconButton>
            </div>
            <div className="bg-gray-100 rounded-lg flex flex-wrap gap-6 items-center h-14 px-4 border-[1px] border-gray-300">
              <div className="font-bold text-xl">
                {subjectDetail.subject_id}
              </div>
              <div className="font-bold text-xl">
                {subjectDetail.subject_ename}
              </div>
            </div>
            <div className="font-mitr font-medium text-[18px]/[26px]">
              เลือกหมวดหมู่ของรายวิชานี้ *
            </div>
            <div className="flex gap-x-10">
              <CategorySelectGroup
                selectedCategory={selectedCategory}
                setSelectCategory={setSelectCategory}
                categoryOptions={categoryOptions}
              />
            </div>
            <div className="flex justify-end pt-1">
              <Button
                startIcon={<SaveIcon />}
                onClick={handleClose}
                size="large"
                variant="contained"
                disabled={!isEnableSave}
              >
                บันทึกหมวดหมู่รายวิชา
              </Button>
            </div>
          </Box>
        </div>
      </Modal>
    </div>
  );
}
