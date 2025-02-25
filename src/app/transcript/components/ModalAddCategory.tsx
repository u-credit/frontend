import { Box, Button, Dialog, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CategorySelectGroup from './CategorySelectGroup';
import { SubjectTranscriptDto } from '@/Interfaces/transcript.interface';
import { initSelectOption } from '@/types';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import { useTranscriptContext } from '@/app/contexts/TranscriptContext';
import { AppDispatch, RootState } from '@/features/store';
import { updateCalculateTranscriptApi } from '@/features/transcriptSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCalculateScheduleBySubjectId,
  ScheduleState,
  selectOriginalItem,
  updateAndRecalculateBookmarkApi,
} from '@/features/scheduleSlice';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { stat } from 'fs';
interface ModalAddCategoryProps {
  open: boolean;
  onClose: () => void;
  subject: SubjectTranscriptDto;
  isSubjectAddCategory?: boolean;
  isUpdateOnSubmit?: boolean;
  subjectFlag?: string;
  showResetCalculation?: boolean;
}

export default function ModalAddCategory({
  open,
  onClose,
  subject,
  isSubjectAddCategory,
  isUpdateOnSubmit,
  subjectFlag,
  showResetCalculation = false,
}: ModalAddCategoryProps) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    categoryOptions,
    selectedCategory,
    setSelectCategory,
    setUnmatchSubjects,
  } = useTranscriptContext();

  const [isEnableSave, setIsEnableSave] = useState(false);

  useEffect(() => {
    if (selectedCategory?.category.value) {
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

  useEffect(() => {
    if (open && isSubjectAddCategory) {
      const category = categoryOptions.find(
        (c) => c.value == String(subject.category),
      );

      const group = category?.children?.find(
        (g) => g.value == String(subject.group),
      );

      const subgroup = group?.children?.find(
        (sg) => sg.value == String(subject.subgroup),
      );

      const childgroup = subgroup?.children?.find(
        (cg) => cg.value == String(subject.childgroup),
      );

      const selectCategory = {
        category: category || initSelectOption(),
        group: group || initSelectOption(),
        subgroup: subgroup || initSelectOption(),
        childgroup: childgroup || initSelectOption(),
      };

      setSelectCategory(selectCategory);
    }
  }, [open, isSubjectAddCategory, subject, categoryOptions]);

  const handleClose = () => {
    setSelectCategory({
      category: initSelectOption(),
      group: initSelectOption(),
      subgroup: initSelectOption(),
      childgroup: initSelectOption(),
    });
    onClose();
  };

  const handleSave = async () => {
    if (isUpdateOnSubmit) {
      if (subjectFlag === 'transcript') {
        dispatch(
          updateCalculateTranscriptApi({
            subjectId: subject.subject_id,
            ...(subject.semester && { semester: subject.semester }),
            ...(subject.year && { year: subject.year }),
            category: Number(selectedCategory.category.value) || null,
            group: Number(selectedCategory.group.value) || null,
            subgroup: Number(selectedCategory.subgroup.value) || null,
            childgroup: Number(selectedCategory.childgroup.value) || null,
          }),
        );
      } else if (subjectFlag === 'schedule') {
        dispatch(
          updateAndRecalculateBookmarkApi({
            subjectId: subject.subject_id,
            semester: subject.semester || 0,
            year: subject.year || 0,
            category: Number(selectedCategory.category.value) || null,
            group: Number(selectedCategory.group.value) || null,
            subgroup: Number(selectedCategory.subgroup.value) || null,
            childgroup: Number(selectedCategory.childgroup.value) || null,
          }),
        );
      }
    } else {
      setUnmatchSubjects((prev) =>
        prev.map((prev_subject) =>
          prev_subject.subject_id === subject.subject_id
            ? {
                ...prev_subject,
                category: Number(selectedCategory.category.value),
                group: Number(selectedCategory.group.value),
                subgroup: Number(selectedCategory.subgroup.value),
                childgroup: Number(selectedCategory.childgroup.value),
              }
            : prev_subject,
        ),
      );
    }

    handleClose();
  };

  const originalItems = useSelector(
    (state: RootState) => state.schedule.originalItems,
  );

  const formatAndUpdateSelectCategory = (
    cat: number,
    gro: number,
    sub: number,
    chi?: number,
  ) => {
    const category = categoryOptions.find((c) => c.value == String(cat));

    const group = category?.children?.find((g) => g.value == String(gro));

    const subgroup = group?.children?.find((sg) => sg.value == String(sub));

    const childgroup = subgroup?.children?.find(
      (cg) => cg.value == String(chi),
    );

    const selectCategory = {
      category: category || initSelectOption(),
      group: group || initSelectOption(),
      subgroup: subgroup || initSelectOption(),
      childgroup: childgroup || initSelectOption(),
    };

    setSelectCategory(selectCategory);
  };

  const handleRecalculate = () => {
    if (subjectFlag === 'schedule') {
      // console.log('ori', originalItems);
      const originalItem = originalItems?.find(
        (item) => item.subject_id === subject.subject_id,
      );
      // console.log('originalItem', originalItem, subject);

      if (!originalItem) return;
      formatAndUpdateSelectCategory(
        originalItem.category,
        originalItem.group,
        originalItem.subgroup,
        originalItem.childgroup,
      );

      // dispatch(
      //   fetchCalculateScheduleBySubjectId({
      //     subjectId: subject.subject_id,
      //     semester: subject.semester || 0,
      //     year: subject.year || 0,
      //   }),
      // );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          padding: '24px',
          margin: '16px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      }}
      maxWidth="md"
      fullWidth
    >
      <Box className="bg-white border-gray-300 flex flex-col gap-2 md:gap-5 ">
        <div className="flex justify-between items-center">
          <div className="font-mitr font-medium text-lg md:text-2xl">
            เพิ่มหมวดหมู่
          </div>
          <IconButton onClick={handleClose}>
            <CloseIcon fontSize="medium" />
          </IconButton>
        </div>
        <div className="bg-gray-100 rounded-lg flex flex-wrap gap-2 md:gap-6 p-4 items-center min-h-14 border-[1px] border-gray-300">
          <p className="font-bold text-md md:text-xl">{subject?.subject_id}</p>
          <p className="font-bold text-md md:text-xl">
            {subject?.subject_ename}
          </p>
        </div>
        <div className="flex gap-2">
          <p className="font-mitr font-medium text-md md:text-xl">
            เลือกหมวดหมู่ของรายวิชานี้
          </p>
          <p className="text-primary-400">*</p>
        </div>
        <div className="flex flex-col md:flex-row md:gap-x-4 gap-y-2 md:gap-y-2">
          <CategorySelectGroup
            selectedCategory={selectedCategory}
            setSelectCategory={setSelectCategory}
            categoryOptions={categoryOptions}
          />
        </div>
        <div className="flex justify-end pt-1 gap-x-3">
          {showResetCalculation && (
            <Button
              startIcon={<AutoAwesomeIcon />}
              onClick={handleRecalculate}
              size="medium"
              variant="outlined"
            >
              คำนวณอัตโนมัติ
            </Button>
          )}
          <Button
            startIcon={<SaveIcon />}
            onClick={handleSave}
            size="medium"
            variant="contained"
            disabled={!isEnableSave}
          >
            บันทึกหมวดหมู่รายวิชา
          </Button>
        </div>
      </Box>
    </Dialog>
  );
}
