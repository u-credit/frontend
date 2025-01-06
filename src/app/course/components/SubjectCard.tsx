import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  Rating,
  Typography,
} from '@mui/material';
import { SubjectDto } from '../../../Interfaces';
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CustomTable from './CustomTable';
import StarIcon from '@mui/icons-material/Star';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { stripHtmlTags } from '@/utils';
import { useRouter } from 'next/navigation';
import { CustomSectionChip } from '@/components';
import { useDispatch, useSelector } from 'react-redux';
import { addBookmark, removeBookmark } from '@/features/bookmark/bookmarkSlice';
import { RootState } from '@/features/store';

interface SubjectCardProps {
  subjectDetail: SubjectDto;
}

export default function SubjectCard({ subjectDetail }: SubjectCardProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { semester, year } = useSelector(
    (state: RootState) => state.selectorValue,
  );
  const bookmark = useSelector((state: RootState) => state.bookmark.items);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [isBookmarked, setIsBookmarked] = useState(false);

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const [daySection, setDaySection] = useState<string[]>(new Array(8).fill(''));

  useEffect(() => {
    const isBookmarked = bookmark.find(
      (item) => item.subjectId === subjectDetail.subject_id,
    );
    if (isBookmarked) {
      setIsBookmarked(true);
      setSelectedSection(isBookmarked.selectedSection || '');
    } else {
      setIsBookmarked(false);
      setSelectedSection('');
    }
  }, [subjectDetail.subject_id, bookmark]);

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (!isBookmarked) {
      dispatch(
        addBookmark({
          subjectId: subjectDetail.subject_id,
          selectedSection: selectedSection,
          semester: Number(semester),
          year: Number(year),
        }),
      );
    } else {
      setSelectedSection('');
      dispatch(removeBookmark(subjectDetail.subject_id));
    }
  };

  const handleExpanded = (event: React.MouseEvent) => {
    // Prevent the accordion from expanding when clicking the summary
    event.stopPropagation();
    setIsExpanded((prevExpanded) => !prevExpanded);
  };

  const handleMoreDetail = () => {
    router.push(`/course/${subjectDetail.subject_id}`);
  };

  useEffect(() => {
    if (subjectDetail.teach_table) {
      const daySection = new Array(8).fill('');
      const dayList: string[][] = Array.from({ length: 8 }, () => []);
      subjectDetail.teach_table.forEach((teach) => {
        daySection[teach.teach_day] += teach.section + ' ';
        dayList[teach.teach_day].push(teach.section);
        const time_str = teach.teach_time_str?.split(',');
        time_str?.forEach((time) => {
          const day = Number(time.split('x')[0]);
          if (day && !dayList[day].includes(teach.section)) {
            daySection[day] += teach.section + ' ';
            dayList[day].push(teach.section);
          }
        });
      });
      setDaySection(daySection);
    }
  }, [subjectDetail]);

  return (
    <div className="relative group">
      <Accordion
        expanded={isExpanded}
        onClick={handleExpanded}
        className="group-hover:bg-gray-50"
        sx={{
          borderRadius: 2,
          borderWidth: 1,
          boxShadow: 'none',
          backgroundColor: 'white',
          cursor: 'pointer',
          '&.Mui-expanded': {
            margin: 0,
          },
          '&.MuiPaper-root': {
            paddingBottom: '56px',
          },
          '&:hover': {
            backgroundColor: 'grey.50',
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{
            '& .MuiAccordionSummary-expandIconWrapper': {
              alignSelf: 'flex-start',
              mt: 1,
            },
            '& .MuiAccordionSummary-content': {
              margin: '16px 0',
            },

            '&.Mui-expanded .MuiAccordionSummary-content': {
              margin: '16px 0',
            },
            '&:hover': {
              backgroundColor: 'grey.50',
            },
          }}
        >
          <div className="flex flex-col">
            <div id="subject-card-header" className="flex flex-col gap-[10px]">
              <div id="row-1" className="flex flex-wrap gap-6 items-center">
                <div className="font-bold text-lg">
                  {subjectDetail.subject_id}
                </div>
                <div
                  className="font-bold text-lg hover:underline"
                  onClick={handleMoreDetail}
                >
                  {subjectDetail.subject_english_name}
                </div>
                {subjectDetail.category &&
                  subjectDetail.category.map((category) => (
                    <Chip
                      key={category.category_id}
                      label={`${category.group_name} + ${category.subgroup_name}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        maxWidth: '300px',
                      }}
                    />
                  ))}
              </div>
              <div id="row-2" className="flex flex-row gap-3">
                <div>{subjectDetail.credit} หน่วยกิต</div>
                <div className="text-primary-400">รีวิว</div>
                <Rating
                  name="half-rating-read"
                  defaultValue={2.5}
                  precision={0.5}
                  readOnly
                  emptyIcon={<StarIcon fontSize="inherit" />}
                  size="small"
                  sx={{
                    alignItems: 'center',
                    '& .MuiRating-iconEmpty': {
                      color: 'grey.200',
                    },
                    '& .MuiRating-iconFilled': {
                      color: 'primary.400',
                    },
                  }}
                />
              </div>
              <div id="row-3" className="flex flex-wrap gap-x-2 gap-y-1">
                {daySection.map((section, index) => {
                  if (section === '') return null;
                  return (
                    <CustomSectionChip key={index} day={index} sec={section} />
                  );
                })}
              </div>
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {subjectDetail.detail ? stripHtmlTags(subjectDetail.detail) : ''}
          </Typography>
          <CustomTable teachTable={subjectDetail?.teach_table} />
        </AccordionDetails>
      </Accordion>
      <div
        id="button-area"
        className="absolute flex items-end justify-end px-4 w-full bottom-4 hover:cursor-pointer"
        onClick={handleExpanded}
      >
        <div className="flex space-x-2">
          <Button
            variant="contained"
            startIcon={isBookmarked ? <CheckIcon /> : <AddIcon />}
            sx={{
              backgroundColor: isBookmarked ? 'white' : undefined,
              color: isBookmarked ? 'primary.main' : undefined,
              borderStyle: 'solid',
              borderWidth: 1,
              borderColor: 'primary.main',
              '&:hover': {
                backgroundColor: isBookmarked ? 'primary.100' : undefined,
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleBookmark();
            }}
          >
            บันทึก
          </Button>
        </div>
      </div>
    </div>
  );
}
