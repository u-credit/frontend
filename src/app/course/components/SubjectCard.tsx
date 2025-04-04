import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  Rating,
  Tooltip,
  Typography,
} from '@mui/material';
import { CategoryDto, SubjectDto } from '../../../Interfaces';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CustomTable from './CustomTable';
import StarIcon from '@mui/icons-material/Star';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { chipCategory, stripHtmlTags } from '@/utils';
import { useRouter } from 'next/navigation';
import { CustomSectionChip } from '@/components';
import { useDispatch, useSelector } from 'react-redux';
import {
  addBookmark,
  removeBookmark,
  selectBookmarkDetail,
  selectIsBookmark,
} from '@/features/bookmark/bookmarkSlice';
import { AppDispatch, RootState } from '@/features/store';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import { addBookmarkApi, deleteBookmarkApi } from '@/api/bookmarkApi';

interface SubjectCardProps {
  subjectDetail: SubjectDto;
}

export default function SubjectCard({ subjectDetail }: SubjectCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { semester, year } = useSelector(
    (state: RootState) => state.selectorValue,
  );
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const [daySection, setDaySection] = useState<string[]>(new Array(8).fill(''));
  const hasBookmark = useSelector((state: RootState) =>
    selectIsBookmark(state, subjectDetail.subject_id),
  );
  const bookmarkDetail = useSelector((state: RootState) =>
    selectBookmarkDetail(state, subjectDetail.subject_id),
  );

  useEffect(() => {
    setIsBookmarked(hasBookmark);
    setSelectedSection(bookmarkDetail?.section || '');
  }, []);

  useEffect(() => {
    setIsBookmarked(hasBookmark);
    setSelectedSection(bookmarkDetail?.section || '');
  }, [hasBookmark, bookmarkDetail]);

  const handleToggleBookmark = async () => {
    setIsBookmarked(!isBookmarked);
    if (!isBookmarked) {
      dispatch(
        addBookmark({
          subjectId: subjectDetail.subject_id,
          section: selectedSection,
          semester: Number(semester),
          year: Number(year),
        }),
      );

      if (isAuthenticated) {
        await addBookmarkApi({
          subjectId: subjectDetail.subject_id,
          section: null,
          semester: Number(semester),
          year: Number(year),
        });
      }
    } else {
      setSelectedSection('');
      dispatch(removeBookmark(subjectDetail.subject_id));

      if (isAuthenticated) {
        await deleteBookmarkApi({
          subjectId: subjectDetail.subject_id,
          semester: Number(semester),
          year: Number(year),
        });
      }
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
        if (daySection[teach.teach_day] != '')
          daySection[teach.teach_day] += ', ';
        daySection[teach.teach_day] += teach.section;
        dayList[teach.teach_day].push(teach.section);
        const time_str = teach.teach_time_str?.split(',');
        time_str?.forEach((time) => {
          const day = Number(time.split('x')[0]);
          if (day && !dayList[day].includes(teach.section)) {
            if (daySection[day] != '') daySection[day] += ', ';
            daySection[day] += teach.section;
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
                {subjectDetail.categories &&
                  subjectDetail.categories.map((category: CategoryDto) => (
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
                            sm: '300px',
                            md: '500px',
                            lg: '600px',
                            xl: '700px',
                          },
                        }}
                      />
                    </Tooltip>
                  ))}
              </div>
              <div id="row-2" className="flex flex-row gap-3">
                <div>{subjectDetail.credit} หน่วยกิต</div>
                <div className="text-primary-400">รีวิว</div>
                <Rating
                  name="half-rating-read"
                  value={subjectDetail.averageRating}
                  precision={0.1}
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
            startIcon={isBookmarked ? <DeleteOutlineIcon /> : <AddIcon />}
            sx={{
              width: { xs: '80px', sm: '100px' },
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
            {isBookmarked ? 'ลบ' : 'บันทึก'}
          </Button>
        </div>
      </div>
    </div>
  );
}
