'use client';
import * as React from 'react';
import Button from '@mui/material/Button';
import TinySubjectCard from './TinySubjectCard';
import CloseIcon from '@mui/icons-material/Close';
import TableChartIcon from '@mui/icons-material/TableChart';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/features/store';
import { BookmarkItem, SubjectDto } from '@/Interfaces';
import { useCallback, useEffect, useState } from 'react';
import { fetchListSubjectByIds } from '@/api/subjectApi';
import { fetchBookmark } from '@/api/bookmarkApi';
import { loadBookmarks, setBookmarks } from '@/features/bookmark/bookmarkSlice';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Typography,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
interface BookmarkModalProps {
  open: boolean;
  onClose: () => void;
}

export default function BookmarkModal({ open, onClose }: BookmarkModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { semester, year, curriGroup } = useSelector(
    (state: RootState) => state.selectorValue,
  );
  const bookmarks = useSelector((state: RootState) => state.bookmark);
  const router = useRouter();
  const handleOpenSchedule = () => {
    router.push(`/schedule`);
  };

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [sumCredit, setSumCredit] = useState(0);
  const [categoryCredit, setCategoryCredit] = useState<{
    [key: string]: number;
  }>({});
  const [listSubjects, setListSubjects] = useState<SubjectDto[]>([]);

  useEffect(() => {
    const loadBookmark = async () => {
      try {
        const response = await fetchBookmark({
          semester: Number(semester),
          year: Number(year),
        });
        const data = response?.data || [];

        dispatch(
          setBookmarks(
            data.map((item) => ({
              subjectId: item.subject_id,
              semester: Number(item.semester),
              year: Number(item.year),
              selectedSection: item.section,
              isShow: item.is_show,
            })),
          ),
        );
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    };

    if (isAuthenticated) {
      loadBookmark();
    }
  }, [dispatch, isAuthenticated, semester, year]);

  const loadSubjects = useCallback(async () => {
    if (bookmarks.length === 0) {
      setListSubjects([]);
      setSumCredit(0);
      setCategoryCredit({});

      return;
    }

    const getSubjectParams = () => ({
      semester: Number(semester),
      year: Number(year),
      subjectIds: bookmarks.map((item: BookmarkItem) => item.subjectId),
      ...(curriGroup &&
        curriGroup.faculty?.value &&
        curriGroup.department?.value &&
        curriGroup.curriculum?.value &&
        curriGroup.curriculumYear?.value && {
          categoryFacultyId: curriGroup.faculty.value,
          categoryDepartmentId: curriGroup.department.value,
          categoryCurriculumId: curriGroup.curriculum.value,
          categoryCurriculumYear: curriGroup.curriculumYear.value,
        }),
    });

    try {
      const response = await fetchListSubjectByIds(getSubjectParams());
      const newSubjects = response?.data || [];

      setListSubjects(newSubjects);

      let catCredit: { [key: string]: number } = {};
      newSubjects.forEach((subject) => {
        if (!subject?.category || !subject.category[0]?.subgroup_name) return;
        const key = subject.category
          .map((cur) => cur.group_name + cur.subgroup_name)
          .join(' หรือ ');
        catCredit[key] = (catCredit[key] || 0) + (subject.credit || 0);
      });

      setCategoryCredit(catCredit);
      const totalCredits = newSubjects
        .filter(
          (subject) =>
            typeof subject.credit === 'number' && !isNaN(subject.credit),
        )
        .reduce((acc, subject) => acc + subject.credit, 0);
      setSumCredit(totalCredits);

    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  }, [bookmarks, curriGroup, semester, year]);

  //ไม่ใส่ semester&year เพราะ bookmark จะเปลี่ยนตาม semester&year ที่เลือกอยู่แล้ว
  useEffect(() => {
    loadSubjects();
  }, [bookmarks, curriGroup]);

  if (!open) return null;
  return (
    <div className="z-10 flex flex-col bg-white p-5 gap-y-2 lg:gap-y-5 absolute top-[52%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-[10px] max-w-5xl max-h-[90vh] w-11/12 overflow-y-auto ">
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
          {bookmarks.map((item: BookmarkItem) => (
            <TinySubjectCard
              key={item.subjectId}
              subjectDetail={
                listSubjects.find(
                  (subject) => subject.subject_id === item.subjectId,
                ) || ({} as SubjectDto)
              }
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
