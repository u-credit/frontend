import { Button, Chip } from '@mui/material';
import { SubjectDto } from '../../../Interfaces';
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import { CustomSectionChip, CustomSelect } from '@/components';
import {
  addBookmark,
  editBookmark,
  removeBookmark,
  selectBookmarkDetail,
  selectIsBookmark,
} from '@/features/bookmark/bookmarkSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/features/store';
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
  const dispatch: AppDispatch = useDispatch();
  const { semester, year } = useSelector(
    (state: RootState) => state.selectorValue,
  );
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [selectedSection, setSelectedSection] = useState<string>('');
  const [isBookmarked, setIsBookmarked] = useState(true);

  const [daySection, setDaySection] = useState<string[]>(new Array(8).fill(''));
  const [sectionList, setSectionList] = useState<string[]>([]);
  const hasBookmark = useSelector((state: RootState) =>
    selectIsBookmark(state, subjectDetail.subject_id),
  );
  const bookmarkDetail = useSelector((state: RootState) =>
    selectBookmarkDetail(state, subjectDetail.subject_id),
  );
  useEffect(() => {
    setIsBookmarked(hasBookmark);
    setSelectedSection(bookmarkDetail?.section || '');
  }, [hasBookmark, bookmarkDetail]);

  const handleSelectSectionChange = async (value: string) => {
    setSelectedSection(value);

    if (isBookmarked) {
      dispatch(
        editBookmark([
          {
            subjectId: subjectDetail.subject_id,
            section: value,
            semester: Number(semester),
            year: Number(year),
          },
        ]),
      );

      if (isAuthenticated) {
        await updateBookmarkApi({
          subjectId: subjectDetail.subject_id,
          section: value,
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
          section: selectedSection,
          semester: Number(semester),
          year: Number(year),
        }),
      );
      if (isAuthenticated) {
        await addBookmarkApi({
          subjectId: subjectDetail.subject_id,
          section: selectedSection,
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
          section: selectedSection,
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
        newSectionList.push(teach.section);
      });
      setDaySection(daySection);
      setSectionList(newSectionList);
    }
  }, [subjectDetail]);

  return (
    <div className="relative">
      <div className="bg-white rounded-lg border-[1px] p-5 border-gray-300 sm:pb-5 pb-[70px] sm:pr-[230px] pr-5">
        <div className="flex flex-col">
          <div id="subject-card-header" className="flex flex-col gap-[10px]">
            <div id="row-1" className="flex flex-wrap gap-x-6 items-center">
              <div className="font-bold text-lg">
                {subjectDetail.subject_id}
              </div>
              <div className="font-bold text-lg">
                {subjectDetail.subject_english_name}
              </div>
              {subjectDetail.category &&
                subjectDetail.category.map((category) => (
                  <Chip
                    key={
                      category.category_id +
                      category.group_name +
                      category.subgroup_name
                    }
                    label={`${category.group_name} + ${category.subgroup_name}`}
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
                ))}
            </div>
            <div id="row-2" className="flex flex-wrap gap-x-2 gap-y-1">
              <div>{subjectDetail.credit} หน่วยกิต</div>
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
        className="absolute flex items-end justify-end px-4 w-full bottom-4"
      >
        <div className="flex space-x-2">
          {/* <CustomSelect
            onSelectedValueChange={handleSelectSectionChange}
            selectOptions={sectionList.map((section) => ({
              label: section,
              value: section,
            }))}
            selectedValue={selectedSection}
          /> */}
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
