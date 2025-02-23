import * as React from 'react';
import Button from '@mui/material/Button';
import TinySubjectCard from './TinySubjectCard';
import CloseIcon from '@mui/icons-material/Close';
import TableChartIcon from '@mui/icons-material/TableChart';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/features/store';
import { SubjectDto } from '@/Interfaces';
import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Typography,
} from '@mui/material';
import { summaryCategoryBookmark } from '@/features/bookmark/bookmarkSlice';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { BookmarkStateItem } from '@/features/bookmark/bookmarkSlice';
interface BookmarkModalProps {
  open: boolean;
  onClose: () => void;
}

export default function BookmarkModal({ onClose }: BookmarkModalProps) {
  const curriGroup = useSelector(
    (state: RootState) => state.faculty.userCurriGroup,
  );
  const bookmarks = useSelector((state: RootState) => state.bookmark.items);
  const summaryCredit = useSelector((state: RootState) =>
    summaryCategoryBookmark(state),
  );
  const router = useRouter();
  const handleOpenSchedule = () => {
    router.push(`/schedule`);
  };

  const [sumCredit, setSumCredit] = useState(summaryCredit.total);
  const [categoryCredit, setCategoryCredit] = useState<{
    [key: string]: number;
  }>(summaryCredit.categoryCredit);

  useEffect(() => {
    setCategoryCredit(summaryCredit.categoryCredit);
    setSumCredit(summaryCredit.total);
  }, [summaryCredit]);

  return (
    <div className="z-50 flex flex-col bg-white p-5 gap-y-2 lg:gap-y-5 absolute top-[52%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-[10px] max-w-5xl max-h-[90vh] w-11/12 overflow-y-auto ">
      <div className="flex justify-between items-center">
        <span className="font-bold text-xl">วิชาที่บันทึกไว้</span>
        <div className="flex gap-x-3">
          <Button
            variant="contained"
            startIcon={<TableChartIcon />}
            sx={{ minWidth: '115px' }}
            onClick={handleOpenSchedule}
          >
            จัดตารางเรียน
          </Button>
          <IconButton
            aria-label="delete"
            sx={{ padding: 0.5 }}
            size="large"
            onClick={onClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </div>
      </div>
      <div className="overflow-y-auto">
        <div className="flex flex-col gap-y-5 max-h-[50vh]">
          {bookmarks
            .filter((item: BookmarkStateItem) => item.detail !== undefined)
            .map((item: BookmarkStateItem) => (
              <TinySubjectCard
                key={item.subjectId}
                subjectDetail={item.detail as SubjectDto}
              />
            ))}
        </div>
      </div>
      {bookmarks.length === 0 && (
        <div className="flex flex-col grow p-10 justify-center items-center self-center font-mitr text-xl text-primary-200">
          ไม่พบรายวิชาที่บันทึกไว้
        </div>
      )}
      {curriGroup ? (
        <div className="lg:hidden">
          <Accordion
            sx={{
              // borderRadius: 2,
              // borderWidth: 1,
              boxShadow: 'none',
              backgroundColor: 'white',
              cursor: 'pointer',
              '&.Mui-expanded': {
                margin: 0,
              },
              '&.MuiPaper-root': {},
              '&:hover': {
                backgroundColor: 'grey.50',
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography component="span">สรุปหน่วยกิต</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {Object.entries(categoryCredit).map(([key, value]) => (
                <div key={key}>
                  {value} หน่วยกิต{' '}
                  <Chip
                    key={key}
                    label={key}
                    size="small"
                    variant="outlined"
                    sx={{
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      '@media (max-width: 600px)': {
                        maxWidth: '200px',
                      },
                      '@media (max-width: 400px)': {
                        maxWidth: '180px',
                      },
                    }}
                  />
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        </div>
      ) : null}
      <div className="hidden lg:flex flex-col w-full gap-2 lg:max-h-[20vh] lg:overflow-y-auto">
        {Object.entries(categoryCredit).map(([key, value]) => (
          <div key={key}>
            {value} หน่วยกิต{' '}
            <Chip
              key={key}
              label={key}
              size="small"
              variant="outlined"
              sx={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                '@media (max-width: 600px)': {
                  maxWidth: '200px',
                },
              }}
            />
          </div>
        ))}
      </div>
      <div className="ml-auto">รวม {sumCredit} หน่วยกิต</div>
    </div>
  );
}
