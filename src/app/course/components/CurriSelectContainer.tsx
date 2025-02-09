'use client';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { initSelectOption, SelectOption } from '@/types';
import { CurriSelectGroup } from '@/components';
import { CurriGroup } from '@/Interfaces';
import { useState } from 'react';

interface CurriSelectContainerProps {
  facultyOptions: SelectOption[];
  onClickApplyCurri: (curriGroup: CurriGroup) => void;
}

export default function CurriSelectContainer({
  facultyOptions,
  onClickApplyCurri,
}: CurriSelectContainerProps) {
  const [selectedCurriGroup, setSelectedCurriGroup] = useState<CurriGroup>({
    faculty: initSelectOption(),
    department: initSelectOption(),
    curriculum: initSelectOption(),
    curriculumYear: initSelectOption(),
  });
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const handleAccordionChange = () => {
    setIsExpanded((prev) => !prev);
  };
  const handleApplyCurri = () => {
    onClickApplyCurri(selectedCurriGroup);
    setTimeout(() => {
      setIsExpanded(false);
    }, 500);
  };
  return (
    <div className="flex bg-white w-11/12 lg:max-w-5xl text-primary-400 rounded-b-lg mx-auto lg:ml-64 lg:mr-4 mb-4 p-4">
      <Accordion
        expanded={isExpanded}
        sx={{
          borderRadius: 2,
          borderWidth: 0,
          boxShadow: 'none',
          backgroundColor: 'white',
          '&.Mui-expanded': {
            margin: 0,
          },
          width: '100%',
        }}
      >
        <AccordionSummary
          onClick={handleAccordionChange}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{
            padding: 0,
            minHeight: 'unset',
            ' &.Mui-expanded': {
              minHeight: 'unset',
              margin: 0,
            },
            '& .MuiAccordionSummary-content': {
              margin: 0,
            },

            '& .MuiAccordionSummary-content.Mui-expanded': {
              margin: 0,
            },
          }}
        >
          <span className="text-primary-400 font-semibold">
            *เพื่อการแสดงผลรายละเอียดหมวดหมู่รายวิชาที่ละเอียดมากยิ่งขึ้น
            โปรดกรอกรายละเอียดหลักสูตรของคุณ
          </span>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 0 }}>
          <div className="flex flex-col sm:flex-row gap-y-2 sm:gap-x-4 mt-4">
            <span className="font-semibold whitespace-nowrap content-center">
              หลักสูตรของคุณ
            </span>
            <CurriSelectGroup
              selectedCurriGroup={selectedCurriGroup}
              setSelectedCurriGroup={setSelectedCurriGroup}
              facultyOptions={facultyOptions}
            />
            <Button
              variant="contained"
              sx={{ minWidth: '80px' }}
              onClick={handleApplyCurri}
              disabled={selectedCurriGroup.curriculumYear.value === ''}
            >
              ปรับใช้
            </Button>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
