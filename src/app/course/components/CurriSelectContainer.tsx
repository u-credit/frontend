'use client';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SelectOption } from '@/types';
import { CurriSelectGroup } from '@/components';
import { CurriGroup } from '@/Interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrigroup } from '@/features/selectorValueSlice';
import { Dispatch, useEffect } from 'react';

interface CurriSelectContainerProps {
  selectedCurriGroup: CurriGroup;
  setSelectedCurriGroup: Dispatch<React.SetStateAction<CurriGroup>>;
  facultyOptions: SelectOption[];
}

export default function CurriSelectContainer({
  selectedCurriGroup,
  setSelectedCurriGroup,
  facultyOptions,
}: CurriSelectContainerProps) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCurrigroup(selectedCurriGroup));
  }, [selectedCurriGroup]);

  return (
    <div className="flex-grow bg-white max-w-3xl text-primary-400 lg:max-w-none rounded-b-lg mx-auto lg:ml-64 lg:mr-4 mb-4 p-4">
      <Accordion
        sx={{
          borderRadius: 2,
          borderWidth: 0,
          boxShadow: 'none',
          backgroundColor: 'white',
          '&.Mui-expanded': {
            margin: 0,
          },
        }}
      >
        <AccordionSummary
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
          <span className="text-primary-400">
            *เพื่อการแสดงผลรายละเอียดหมวดหมู่รายวิชาที่ละเอียดมากยิ่งขึ้น
            โปรดกรอกรายละเอียดหลักสูตรของคุณ
          </span>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 0 }}>
          <div className="flex flex-row gap-x-7 mt-4">
            <span className="font-semibold whitespace-nowrap content-center">
              หลักสูตรของคุณ
            </span>{' '}
            <CurriSelectGroup
              selectedCurriGroup={selectedCurriGroup}
              setSelectedCurriGroup={setSelectedCurriGroup}
              facultyOptions={facultyOptions}
            />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
