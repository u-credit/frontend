'use client';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import Sidebar from './components/Sidebar';
import {
  CurriGroup,
  CursorMetaDto,
  ListSubjectQueryParams,
  SubjectDto,
} from '@/Interfaces';
import { fetchListSubject } from '@/api/subjectApi';
import { SelectOption } from '@/types';
import {
  BookmarkModal,
  CurriSelectContainer,
  SubjectContainer,
} from './components';
import { useInView } from 'react-intersection-observer';
import { ListSubjectOrderBy, Order, SubjectCategory } from '@/enums';
import { fetchListFaculty } from '@/api/facultyApi';
import { CustomSearchBar, CustomSelect } from '@/components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/features/store';
import { setSemester, setYear } from '@/features/selectorValueSlice';
import Cookies from 'js-cookie';
interface FilterGroup {
  courseCategory: string[];
  yearLevel: string;
  classDay: string[];
  classTime: string[];
}

const semesterOptions: SelectOption[] = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
];

const yearOptions: SelectOption[] = [
  { label: '2563', value: '2563' },
  { label: '2564', value: '2564' },
  { label: '2565', value: '2565' },
  { label: '2566', value: '2566' },
];

export default function Course() {
  const dispatch = useDispatch();
  const { semester, year } = useSelector(
    (state: RootState) => state.selectorValue,
  );
  const [selectedSemester, setSelectedSemester] = useState<string>('1');
  const [selectedYear, setSelectedYear] = useState<string>('2566');
  const [filterValues, setFilterValues] = useState<FilterGroup>({
    courseCategory: [],
    yearLevel: '',
    classDay: [],
    classTime: [],
  });
  const [customStartTimeFilter, setCustomStartTimeFilter] =
    useState<string>('');
  const [customEndTimeFilter, setCustomEndTimeFilter] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [facultyOptions, setFacultyOptions] = useState<SelectOption[]>([]);
  const [selectedCurriGroup, setSelectedCurriGroup] = useState<CurriGroup>({
    faculty: '',
    department: '',
    curriculum: '',
    curriculumYear: '',
  });
  const [listSubjects, setListSubjects] = useState<SubjectDto[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { ref, inView } = useInView();
  const [openBookmarkModal, setOpenBookmarkModal] = useState(false);
  const [sendCustomTime, setSendCustomTime] = useState<boolean>(false);

  const handleOpen = () => setOpenBookmarkModal(true);
  const handleClose = () => {
    setOpenBookmarkModal(false);
  };

  const loadSubjects = useCallback(
    async (isLoadMore = false) => {
      if (semester === '' || year === '') return;

      const getCategory = (category: string[]): SubjectCategory => {
        if (category.length === 2) return SubjectCategory.ALL;
        else if (category.includes(SubjectCategory.GENERAL))
          return SubjectCategory.GENERAL;
        return SubjectCategory.MAJOR;
      };

      const getSubjectParams = (
        cursor = '',
        limit = 10,
      ): ListSubjectQueryParams => ({
        semester: Number(selectedSemester),
        year: Number(selectedYear),
        keyword: searchValue || undefined,
        limit,
        cursor,
        direction: Order.ASC,
        orderBy: ListSubjectOrderBy.SUBJECT_ID,
        ...(filterValues.courseCategory.length > 0 && {
          subjectCategory: getCategory(filterValues.courseCategory),
        }),
        ...(filterValues.classDay.length > 0 && {
          day: filterValues.classDay.map((day) => Number(day)),
        }),
        rangeTime: sendCustomTime
          ? filterValues.classTime.concat(
              `${customStartTimeFilter}-${customEndTimeFilter}`,
            )
          : filterValues.classTime,
        ...(selectedCurriGroup.faculty &&
          selectedCurriGroup.department &&
          selectedCurriGroup.curriculum && {
            facultyId: selectedCurriGroup.faculty,
            departmentId: selectedCurriGroup.department,
            curriculumId: selectedCurriGroup.curriculum,
            ...(selectedCurriGroup.curriculumYear && {
              curriculumYear: selectedCurriGroup.curriculumYear,
            }),
          }),
        ...(filterValues.yearLevel && {
          yearLevel: Number(filterValues.yearLevel),
        }),
      });

      if (isLoadMore && (isLoading || !hasMore)) return;

      const params = getSubjectParams(
        isLoadMore ? listSubjects?.[listSubjects.length - 1]?.subject_id : '',
      );

      setIsLoading(true);
      try {
        const response = await fetchListSubject(params);
        const newSubjects = response?.data || [];
        setListSubjects((prev) =>
          isLoadMore ? [...prev, ...newSubjects] : newSubjects,
        );
        setHasMore((response?.meta as CursorMetaDto)?.hasNext ?? false);
      } catch (error) {
        console.error('Error loading subjects:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [
      semester,
      year,
      isLoading,
      hasMore,
      listSubjects,
      selectedSemester,
      selectedYear,
      searchValue,
      filterValues.courseCategory,
      filterValues.classDay,
      filterValues.classTime,
      filterValues.yearLevel,
      sendCustomTime,
      customStartTimeFilter,
      customEndTimeFilter,
      selectedCurriGroup.faculty,
      selectedCurriGroup.department,
      selectedCurriGroup.curriculum,
      selectedCurriGroup.curriculumYear,
    ],
  );

  useEffect(() => {
    const loadFaculty = async () => {
      try {
        const data = (await fetchListFaculty())?.data || [];
        const facultyOptions: SelectOption[] = data.map((faculty) => ({
          label: faculty.faculty_name,
          value: faculty.faculty_id,
          children: faculty.department?.map((department) => ({
            label: department.department_name,
            value: department.department_id,
            children: department.curriculum?.map((curriculum) => ({
              label: curriculum.curriculum_name,
              value: curriculum.curriculum_id,
              children: curriculum.curriculum_year?.map((year) => ({
                label: year,
                value: year,
              })),
            })),
          })),
        }));
        setFacultyOptions(facultyOptions);
      } catch (error) {
        console.error('Error loading faculty:', error);
      }
    };

    loadFaculty();
    loadSubjects();
  }, []);

  useEffect(() => {
    loadSubjects();
  }, [selectedSemester, selectedYear, selectedCurriGroup]);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadSubjects(true);
    }
  }, [inView, hasMore, isLoading]);

  const handleSearchValueChange = (value: string) => setSearchValue(value);

  const handleSearchAction = () => loadSubjects();

  const handleCurriGroup = (value: CurriGroup) => {
    setSelectedCurriGroup(value);
  };

  const handleSelectSemester = (value: string) => {
    setSelectedSemester(value);
    dispatch(setSemester(value));
  };

  const handleSelectYear = (value: string) => {
    setSelectedYear(value);
    dispatch(setYear(value));
  };

  useEffect(() => {
    setSelectedSemester(semester);
    setSelectedYear(year);
  }, [semester, year]);

  const handleFilterChange = (group: string, value: string | string[]) => {
    setFilterValues((prevValues) => {
      const currentValue = prevValues[group as keyof FilterGroup];
      if (group === 'yearLevel') {
        return {
          ...prevValues,
          [group]: value as string,
        };
      } else {
        const updatedValues =
          Array.isArray(currentValue) && currentValue.includes(value as string)
            ? currentValue.filter((item) => item !== (value as string))
            : [...(Array.isArray(currentValue) ? currentValue : []), value];

        return {
          ...prevValues,
          [group]: updatedValues,
        };
      }
    });
  };
  const handleCustomStartTimeChange = (value: string) => {
    setCustomStartTimeFilter(value);
  };
  const handleCustomEndTimeChange = (value: string) => {
    setCustomEndTimeFilter(value);
  };
  return (
    <main className="flex flex-row bg-gray-100 min-h-[calc(100vh-48px)] w-full">
      <div className="hidden lg:flex fixed min-w-60  bg-white h-full">
        <Sidebar
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          onSelectCustomTime={(e) => setSendCustomTime(e)}
          onCustomStartTimeChange={handleCustomStartTimeChange}
          onCustomEndTimeChange={handleCustomEndTimeChange}
          onClickFilterSearch={handleSearchAction}
        />
      </div>
      <div className="w-full">
        <CurriSelectContainer
          selectedCurriGroup={selectedCurriGroup}
          facultyOptions={facultyOptions}
          onCurriGroupChange={handleCurriGroup}
        />
        <div className="flex-grow bg-white max-w-3xl lg:max-w-none rounded-lg mx-auto lg:ml-64 lg:mr-4 my-4">
          <div className="flex flex-col sm:flex-row p-4 gap-4 justify-between">
            <CustomSearchBar
              onSearchValueChange={handleSearchValueChange}
              onSearchAction={handleSearchAction}
            />
            <div className="flex flex-row gap-2 justify-between sm:ml-auto sm:gap-4">
              <CustomSelect
                onSelectedValueChange={handleSelectSemester}
                selectOptions={semesterOptions}
                selectedValue={selectedSemester}
                label="ภาคเรียน"
              />
              <CustomSelect
                onSelectedValueChange={handleSelectYear}
                selectOptions={yearOptions}
                selectedValue={selectedYear}
                label="ปีการศึกษา"
              />
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{ minWidth: '130px' }}
                onClick={handleOpen}
              >
                วิชาที่บันทึก
              </Button>
            </div>
          </div>
          <SubjectContainer subjectDetail={listSubjects} />
          {hasMore && <div ref={ref}>Load more</div>}
          {!hasMore && !isLoading && <>ไม่พบข้อมูล</>}
        </div>
      </div>
      <BookmarkModal open={openBookmarkModal} onClose={handleClose} />
    </main>
  );
}
