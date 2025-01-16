import { Button, Chip, Rating } from '@mui/material';
import { SubjectDto } from '../../../Interfaces';
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import StarIcon from '@mui/icons-material/Star';
import { CustomSectionChip, CustomSelect } from '@/components';
import {
  addBookmark,
  editBookmark,
  removeBookmark,
} from '@/features/bookmark/bookmarkSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/features/store';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import {
  addBookmarkApi,
  deleteBookmarkApi,
  updateBookmarkApi,
} from '@/api/bookmarkApi';

interface SubjectCardProps {
  subjectDetail: SubjectDto;
}

export default function TinySubjectCard({ subjectDetail }: SubjectCardProps) {
  const dispatch = useDispatch();
  const { semester, year } = useSelector(
    (state: RootState) => state.selectorValue,
  );
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const bookmark = useSelector((state: RootState) => state.bookmark.items);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [isBookmarked, setIsBookmarked] = useState(true);

  const [daySection, setDaySection] = useState<string[]>(new Array(8).fill(''));
  const [sectionList, setSectionList] = useState<string[]>([]);

  useEffect(() => {
    const isBookmarked = bookmark.find(
      (item) => item.subjectId === subjectDetail.subject_id,
    );
    if (isBookmarked) {
      setIsBookmarked(true);
      setSelectedSection(isBookmarked.selectedSection || '');
    }
  }, [subjectDetail.subject_id, bookmark]);

  const handleSelectSectionChange = async (value: string) => {
    setSelectedSection('');

    if (isBookmarked) {
      dispatch(
        editBookmark({
          subjectId: subjectDetail.subject_id,
          selectedSection: value,
          semester: Number(semester),
          year: Number(year),
        }),
      );

      if (isAuthenticated) {
        await updateBookmarkApi({
          subjectId: subjectDetail.subject_id,
          selectedSection: value,
          semester: Number(semester),
          year: Number(year),
        });
      }
    }
  };

  const handleToggleBookmark = async () => {
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
      if (isAuthenticated) {
        await addBookmarkApi({
          subjectId: subjectDetail.subject_id,
          selectedSection: '',
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
          selectedSection: '',
          semester: Number(semester),
          year: Number(year),
        });
      }
    }
  };

  useEffect(() => {
    if (subjectDetail.teach_table) {
      const daySection = new Array(8).fill('');
      const dayList: string[][] = Array.from({ length: 8 }, () => []);
      const newSectionList: string[] = [];
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
        newSectionList.push(teach.section);
      });
      setDaySection(daySection);
      setSectionList(newSectionList);
    }
  }, [subjectDetail]);

  return (
    <div className="relative">
      <div className="bg-white rounded-lg border-[1px] p-4 border-gray-300 pb-[70px]">
        <div className="flex flex-col">
          <div id="subject-card-header" className="flex flex-col gap-[10px]">
            <div id="row-1" className="flex flex-wrap gap-6 items-center">
              <div className="font-bold text-lg">
                {subjectDetail.subject_id}
              </div>
              <div className="font-bold text-lg">
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
              <Rating
                name="half-rating-read"
                defaultValue={2.5}
                precision={0.5}
                readOnly
                emptyIcon={<StarIcon fontSize="inherit" />}
                sx={{
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
      </div>
      <div
        id="button-area"
        className="absolute flex items-end justify-between px-4 w-full bottom-4"
      >
        <span className="text-sm">เปิดในเทอมนี้</span>
        <div className="flex space-x-2">
          <CustomSelect
            onSelectedValueChange={handleSelectSectionChange}
            selectOptions={sectionList.map((section) => ({
              label: section,
              value: section,
            }))}
            selectedValue={selectedSection}
          />
          <Button
            variant="contained"
            startIcon={isBookmarked ? <CheckIcon /> : <AddIcon />}
            sx={{
              // minWidth: '115px',
              backgroundColor: isBookmarked ? 'white' : undefined,
              color: isBookmarked ? 'primary.main' : undefined,
              borderStyle: 'solid',
              borderWidth: 1,
              borderColor: 'primary.main',
              '&:hover': {
                backgroundColor: isBookmarked ? 'primary.100' : undefined,
              },
            }}
            onClick={handleToggleBookmark}
          >
            บันทึก
          </Button>
        </div>
      </div>
    </div>
  );
}
