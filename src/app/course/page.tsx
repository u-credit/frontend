'use client';
import { useCallback, useEffect, useState } from 'react';
import { Button, Chip } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import Sidebar, { FilterGroup } from './components/Sidebar';
import {
  CurriGroup,
  CursorMetaDto,
  ListSubjectQueryParams,
  SubjectDto,
} from '@/Interfaces';
import { fetchListSubject } from '@/api/subjectApi';
import { initSelectOption, SelectOption } from '@/types';
import {
  BookmarkModal,
  CurriSelectContainer,
  SubjectContainer,
  FilterRow,
} from './components';
import { useInView } from 'react-intersection-observer';
import { ListSubjectOrderBy, Order, SubjectCategory } from '@/enums';
import { fetchListFaculty } from '@/api/facultyApi';
import { CustomSearchBar, CustomSelect } from '@/components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/features/store';
import { setSemester, setYear } from '@/features/selectorValueSlice';

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
  const [selectedSemester, setSelectedSemester] = useState<string>(semester);
  const [selectedYear, setSelectedYear] = useState<string>(year);
  const [filterValues, setFilterValues] = useState<FilterGroup>({
    courseCategory: [],
    yearLevel: {
      value: '',
      label: '',
    },
    classDay: [],
    classTime: [],
    faculty: {
      value: '01',
      label: '',
    },
    department: {
      value: '05',
      label: '',
    },
    curriculum: {
      value: '06',
      label: '',
    },
  });
  const [customStartTimeFilter, setCustomStartTimeFilter] =
    useState<string>('');
  const [customEndTimeFilter, setCustomEndTimeFilter] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [facultyOptions, setFacultyOptions] = useState<SelectOption[]>([]);
  const [selectedCurriGroup, setSelectedCurriGroup] = useState<CurriGroup>({
    faculty: initSelectOption(),
    department: initSelectOption(),
    curriculum: initSelectOption(),
    curriculumYear: initSelectOption(),
  });
  const [listSubjects, setListSubjects] = useState<SubjectDto[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { ref, inView } = useInView();
  const [openBookmarkModal, setOpenBookmarkModal] = useState(false);
  const [sendCustomTime, setSendCustomTime] = useState<boolean>(false);
  const [totalSearchSubject, setTotalSearchSubject] = useState<number | null>(
    null,
  );

  const handleOpen = () => setOpenBookmarkModal(true);
  const handleClose = () => {
    setOpenBookmarkModal(false);
  };

  const loadSubjects = useCallback(
    async ({ isLoadMore = false, isInit = false }) => {
      if (semester === '' || year === '') return;

      const getCategory = (category: string[]): SubjectCategory => {
        if (category.length === 2) return SubjectCategory.ALL;
        else if (category.includes(SubjectCategory.GENERAL))
          return SubjectCategory.GENERAL;
        return SubjectCategory.MAJOR;
      };

      const getSubjectParams = (
        cursor = '',
        secondaryCursor = '',
        limit = 10,
      ): ListSubjectQueryParams => ({
        semester: Number(selectedSemester),
        year: Number(selectedYear),
        keyword: searchValue || undefined,
        limit,
        cursor,
        secondaryCursor,
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
        ...(filterValues.faculty.value &&
          filterValues.department.value &&
          filterValues.curriculum.value && {
            facultyId: filterValues.faculty.value,
            departmentId: filterValues.department.value,
            curriculumId: filterValues.curriculum.value,
          }),
        ...(selectedCurriGroup.faculty.value &&
          selectedCurriGroup.department.value &&
          selectedCurriGroup.curriculum.value && {
            categoryFacultyId: selectedCurriGroup.faculty.value,
            categoryCurriculumId: selectedCurriGroup.curriculum.value,
            categoryCurriculumYear: selectedCurriGroup.curriculumYear.value,
          }),
        ...(filterValues.yearLevel && {
          yearLevel: Number(filterValues.yearLevel.value),
        }),
      });

      if (isLoadMore && (isLoading || !hasMore)) return;

      const lastSubject = listSubjects?.[listSubjects.length - 1];
      const params = getSubjectParams(
        isLoadMore ? lastSubject.subject_id : '',
        isLoadMore ? lastSubject.category?.length.toString() : '',
      );

      setIsLoading(true);
      try {
        console.log('listsub', listSubjects);
        const response = await fetchListSubject(params);
        const newSubjects = response?.data || [];
        setListSubjects((prev) =>
          isLoadMore ? [...prev, ...newSubjects] : newSubjects,
        );
        if (!isLoadMore && !isInit) {
          setTotalSearchSubject((response?.meta as CursorMetaDto).totalItems);
        }
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
      filterValues.faculty.value,
      filterValues.department.value,
      filterValues.curriculum.value,
      filterValues.yearLevel,
      sendCustomTime,
      customStartTimeFilter,
      customEndTimeFilter,
      selectedCurriGroup.faculty.value,
      selectedCurriGroup.department.value,
      selectedCurriGroup.curriculum.value,
      selectedCurriGroup.curriculumYear.value,
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
    loadSubjects({ isInit: true });
  }, []);

  useEffect(() => {
    if (
      (selectedCurriGroup.faculty &&
        selectedCurriGroup.department &&
        selectedCurriGroup.curriculum &&
        selectedCurriGroup.curriculumYear) ||
      (!selectedCurriGroup.faculty &&
        !selectedCurriGroup.department &&
        !selectedCurriGroup.curriculum &&
        !selectedCurriGroup.curriculumYear)
    ) {
      loadSubjects({ isLoadMore: false });
    }
  }, [selectedSemester, selectedYear, selectedCurriGroup]);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadSubjects({
        isLoadMore: true,
      });
    }
  }, [inView, hasMore, isLoading]);

  const handleSearchValueChange = (value: string) => setSearchValue(value);

  const handleSearchAction = () => loadSubjects({ isLoadMore: false });

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

  const handleFilterChange = (
    group: string,
    value: SelectOption | string | string[],
  ) => {
    setFilterValues((prevValues) => {
      const currentValue = prevValues[group as keyof FilterGroup];
      if (
        group === 'yearLevel' ||
        group === 'faculty' ||
        group === 'department' ||
        group === 'curriculum'
      ) {
        return {
          ...prevValues,
          [group]: value,
        };
      } else {
        if (Array.isArray(value)) {
          return {
            ...prevValues,
            [group]: value,
          };
        }
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
  const handleDeleteFilter = (group: string, value: string) => {
    setFilterValues(
      (prevValues) =>
        ({
          ...prevValues,
          [group as keyof FilterGroup]: (
            prevValues[group as keyof FilterGroup] as string[]
          ).filter((item) => item !== value),
        }) as FilterGroup,
    );
  };

  return (
    <main className="flex flex-row bg-gray-100 min-h-[calc(100vh-48px)] w-full">
      <div className="hidden lg:flex fixed w-60  bg-white h-full">
        <Sidebar
          filterValues={filterValues}
          facultyOptions={facultyOptions}
          customStartTime={customStartTimeFilter}
          customEndTime={customEndTimeFilter}
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
          setSelectedCurriGroup={setSelectedCurriGroup}
          facultyOptions={facultyOptions}
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
          <FilterRow
            totalSearchSubject={totalSearchSubject || 0}
            filterValues={filterValues}
            setFilterValues={setFilterValues}
            customStartTimeFilter={customStartTimeFilter}
            customEndTimeFilter={customEndTimeFilter}
            setCustomStartTimeFilter={setCustomStartTimeFilter}
            setCustomEndTimeFilter={setCustomEndTimeFilter}
            handleDeleteFilter={handleDeleteFilter}
          />
          <SubjectContainer subjectDetail={listSubjects} />
          {hasMore && <div ref={ref}>Load more</div>}
          {!hasMore && !isLoading && (
            <div className="flex p-10 justify-center items-center">
              ไม่มีข้อมูล
            </div>
          )}
        </div>
      </div>
      <BookmarkModal open={openBookmarkModal} onClose={handleClose} />
    </main>
  );
}
