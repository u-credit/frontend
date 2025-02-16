'use client';
import { use, useCallback, useEffect, useRef, useState } from 'react';
import { Button, LinearProgress } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import Sidebar, { FilterGroup } from './components/Sidebar';
import {
  CurriGroup,
  CursorMetaDto,
  ListSubjectQueryParams,
} from '@/Interfaces';
import { fetchListSubject, fetchListSubjectByIds } from '@/api/subjectApi';
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
import { AppDispatch, RootState } from '@/features/store';
import {
  setCurrigroup,
  setSemester,
  setYear,
} from '@/features/selectorValueSlice';
import TuneIcon from '@mui/icons-material/Tune';
import CourseProvider, { useCourseContext } from '../contexts/CourseContext';
import {
  BookmarkStateItem,
  loadBookmarks,
  saveBookmarks,
  setBookmarks,
  updateBookmarksOnCurriChange,
} from '@/features/bookmark/bookmarkSlice';
import { addMultipleBookmarkApi, fetchBookmark } from '@/api/bookmarkApi';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import {
  formatBookmarksDtoToItem,
  formatFacultyOption,
  getAllBookmarks,
} from '@/utils';
import AddBookmarkModal from './components/AddBookmarkModal';
import Backdrop from '@/components/Backdrop';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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

export default function CourseWrapper() {
  return (
    <CourseProvider>
      <Course />
    </CourseProvider>
  );
}

function Course() {
  const dispatch = useDispatch<AppDispatch>();
  const { listSubjects, setListSubjects } = useCourseContext();
  const { semester, year } = useSelector(
    (state: RootState) => state.selectorValue,
  );
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [selectedSemester, setSelectedSemester] = useState<string>(semester);
  const [selectedYear, setSelectedYear] = useState<string>(year);
  const [filterValues, setFilterValues] = useState<FilterGroup>({
    courseCategory: [],
    yearLevel: initSelectOption(),
    classDay: [],
    classTime: [],
    faculty: initSelectOption(),
    department: initSelectOption(),
    curriculum: initSelectOption(),
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
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const { ref, inView } = useInView();
  const [openBookmarkModal, setOpenBookmarkModal] = useState(false);
  const [openAddBookmarkModal, setOpenAddBookmarkModal] = useState(false);
  const [sendCustomTime, setSendCustomTime] = useState<boolean>(false);
  const [totalSearchSubject, setTotalSearchSubject] = useState<number | null>(
    null,
  );
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [changeFromDelete, setChangeFromDelete] = useState(false);
  const [clickBackdropToClose, setClickBackdropToClose] = useState(true);
  const controllerRef = useRef<AbortController | null>(null);
  const [addMultipleBookmark, setAddMultipleBookmark] = useState<
    boolean | null
  >(null);

  const toggleFilterModal = () => {
    const toggleValue = !isOpenFilter;
    document.documentElement.style.overflowY = toggleValue ? 'hidden' : 'auto';
    setIsOpenFilter(toggleValue);
  };

  const handleOpen = () => {
    document.documentElement.style.overflowY = 'hidden';
    setOpenBookmarkModal(true);
  };
  const handleClose = () => {
    document.documentElement.style.overflowY = 'auto';
    setOpenBookmarkModal(false);
  };

  const loadSubjects = useCallback(
    async ({ isLoadMore = false, isInit = false }) => {
      if (semester === '' || year === '') return;
      if (controllerRef.current) {
        controllerRef.current.abort(); // ยกเลิก request ก่อนหน้า (ถ้ามี)
      }

      controllerRef.current = new AbortController();
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

      setIsLoading(true);
      setHasMore(false);
      const lastSubject = listSubjects?.[listSubjects.length - 1];
      const params = getSubjectParams(
        isLoadMore ? lastSubject.subject_id : '',
        isLoadMore ? lastSubject.category?.length.toString() : '',
      );

      try {
        const response = await fetchListSubject(
          params,
          controllerRef.current.signal,
        );
        const newSubjects = response?.data || [];
        if (isLoadMore) {
          setListSubjects([...listSubjects, ...newSubjects]);
        } else {
          setListSubjects(newSubjects);
        }
        if (!isLoadMore && !isInit) {
          setTotalSearchSubject((response?.meta as CursorMetaDto).totalItems);
        }
        setHasMore((response?.meta as CursorMetaDto)?.hasNext ?? false);
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          console.log('Fetch aborted (ไม่ใช่ error จริง)');
        } else {
        }
      } finally {
        setIsLoading(false);
      }
    },
    [
      semester,
      year,
      isLoading,
      hasMore,
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
        const facultyOptions: SelectOption[] = formatFacultyOption(data);
        setFacultyOptions(facultyOptions);
      } catch (error) {
        console.error('Error loading faculty:', error);
      }
    };

    loadFaculty();
    loadSubjects({ isInit: true }).then(() => setIsFirstLoad(false));
    document.documentElement.style.overflowY = 'auto';
  }, []);

  useEffect(() => {
    if (changeFromDelete) return;
    if (isFirstLoad) return;
    loadSubjects({ isLoadMore: false });
  }, [
    selectedSemester,
    selectedYear,
    selectedCurriGroup,
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
  ]);

  useEffect(() => {
    if (isFirstLoad) return;
    if (inView && hasMore && !isLoading) {
      setIsLoadingMore(true);
      loadSubjects({
        isLoadMore: true,
      }).then(() => setIsLoadingMore(false));
    }
  }, [inView, hasMore, isLoading]);

  useEffect(() => {
    if (isFirstLoad) return;
    if (changeFromDelete) {
      loadSubjects({ isLoadMore: false });
      setChangeFromDelete(false);
    }
  }, [filterValues, customStartTimeFilter, customEndTimeFilter]);

  const handleSearchValueChange = (value: string) => setSearchValue(value);

  const handleSearchBar = () => {
    loadSubjects({ isLoadMore: false });
  };

  const handleSearchAction = (
    filterValues: FilterGroup,
    customStart: string,
    customEnd: string,
    customTime: boolean,
  ) => {
    setFilterValues(filterValues);
    setCustomStartTimeFilter(customStart);
    setCustomEndTimeFilter(customEnd);
    setSendCustomTime(customTime);
  };

  const handleSearchActionAndClose = (
    filterValues: FilterGroup,
    customStart: string,
    customEnd: string,
    customTime: boolean,
  ) => {
    setFilterValues(filterValues);
    setCustomStartTimeFilter(customStart);
    setCustomEndTimeFilter(customEnd);
    setSendCustomTime(customTime);
    toggleFilterModal();
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
    setChangeFromDelete(true);
  };

  const resetFilter = () => {
    setFilterValues({
      courseCategory: [],
      yearLevel: initSelectOption(),
      classDay: [],
      classTime: [],
      faculty: initSelectOption(),
      department: initSelectOption(),
      curriculum: initSelectOption(),
    });
    setCustomStartTimeFilter('');
    setCustomEndTimeFilter('');
    setSendCustomTime(false);
    setChangeFromDelete(true);
  };
  const handleApplyCurriGroup = (curriGroup: CurriGroup) => {
    setSelectedCurriGroup(
      curriGroup
        ? {
            faculty: curriGroup.faculty,
            department: curriGroup.department,
            curriculum: curriGroup.curriculum,
            curriculumYear: curriGroup.curriculumYear,
          }
        : {
            faculty: initSelectOption(),
            department: initSelectOption(),
            curriculum: initSelectOption(),
            curriculumYear: initSelectOption(),
          },
    );
    dispatch(setCurrigroup(curriGroup));
    dispatch(updateBookmarksOnCurriChange());
  };

  useEffect(() => {
    if (openAddBookmarkModal === true) return;
    const loadBookmark = async () => {
      try {
        if (addMultipleBookmark) {
          await addMultipleBookmarkApi(getAllBookmarks());
          setAddMultipleBookmark(false);
        }
        const response = await fetchBookmark({
          semester: Number(semester),
          year: Number(year),
        });
        const data = response?.data || [];
        const formatData = formatBookmarksDtoToItem(data);
        if (formatData.length > 0) {
          const response2 = (
            await fetchListSubjectByIds({
              semester: Number(semester),
              year: Number(year),
              subjectIds: [...formatData.map((item) => item.subjectId)],
            })
          ).data;

          if (response.data.length > 0) {
            const updatedBookmarksWithDetail: BookmarkStateItem[] =
              formatData.map((item) => {
                const subject = response2.find(
                  (subject) => subject.subject_id === item.subjectId,
                );
                return {
                  ...item,
                  detail: subject,
                };
              });

            saveBookmarks(semester, year, updatedBookmarksWithDetail);
            dispatch(setBookmarks(updatedBookmarksWithDetail));
          }
        } else {
          saveBookmarks(semester, year, formatData);
          dispatch(setBookmarks(formatData));
          console.log('No subject details found for bookmarks');
        }
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    };

    if (isAuthenticated) {
      loadBookmark();
    } else {
      dispatch(loadBookmarks());
    }
  }, [dispatch, isAuthenticated, semester, year, addMultipleBookmark]);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    const login = searchParams.get('login');
    if (!localStorage.getItem('bookmark')) {
      setAddMultipleBookmark(false);
    } else {
      if (login === 'true') {
        setOpenAddBookmarkModal(true);
      }
    }
    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.delete('login');

    const newUrl = `${pathname}?${updatedSearchParams.toString()}`;
    router.replace(newUrl);
  }, [pathname, router, searchParams]);

  const handleCloseBackdrop = () => {
    setIsOpenFilter(false);
    setOpenBookmarkModal(false);
    setOpenAddBookmarkModal(false);
    document.documentElement.style.overflowY = 'auto';
  };

  useEffect(() => {
    setClickBackdropToClose(!openAddBookmarkModal);
  }, [openAddBookmarkModal]);

  return (
    <main className="flex flex-row bg-gray-100 w-full ">
      <div className="hidden lg:flex fixed w-60  bg-white h-full">
        <Sidebar
          filterValues={filterValues}
          facultyOptions={facultyOptions}
          customStartTime={customStartTimeFilter}
          customEndTime={customEndTimeFilter}
          checkCustomTime={sendCustomTime}
          onClickFilterSearch={handleSearchAction}
        />
      </div>
      <div className="flex flex-col w-full lg:w-[calc(100%-240px)] h-fit min-h-[calc(100vh-160px)]">
        <CurriSelectContainer
          facultyOptions={facultyOptions}
          onClickApplyCurri={handleApplyCurriGroup}
        />
        <div className="flex flex-col min-h-[calc(100vh-160px)] bg-white w-11/12 lg:max-w-5xl rounded-lg mx-auto lg:ml-64 lg:mr-4 my-4">
          <div className="flex flex-col h-full sm:flex-row p-4 gap-4 justify-between">
            <div className="flex flex-row gap-2 sm:gap-4 w-full">
              <div className="lg:hidden">
                <Button
                  variant="contained"
                  startIcon={<TuneIcon />}
                  sx={{
                    minWidth: '50px',
                    height: '100%',
                    '.MuiButton-startIcon': {
                      margin: 0,
                    },
                  }}
                  onClick={toggleFilterModal}
                ></Button>
              </div>
              <CustomSearchBar
                onSearchValueChange={handleSearchValueChange}
                onSearchAction={handleSearchBar}
              />
            </div>
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
            resetFilter={resetFilter}
            setSendCustomTime={setSendCustomTime}
            setChangeFromDelete={setChangeFromDelete}
          />
          {isLoading && !isLoadingMore ? (
            <div className="flex flex-col grow justify-center items-center h-full">
              <div className="w-80">
                <LinearProgress color="primary" />
              </div>
              <div className="text-primary-400 font-medium">Loading</div>
            </div>
          ) : (
            <SubjectContainer subjectDetail={listSubjects} />
          )}
          {hasMore && !isLoading ? (
            <div className="text-center text-lg font-medium pb-4" ref={ref}>
              Load more
            </div>
          ) : null}
          {isLoadingMore && (
            <div className="text-center text-lg font-medium pb-4">
              Loading...
            </div>
          )}
          {!hasMore &&
            !isLoading &&
            listSubjects.length === 0 &&
            !isFirstLoad && (
              <div className="flex flex-col grow p-10 justify-center items-center self-center font-mitr text-2xl text-primary-200">
                <div className="text-6xl pb-10">(｡•́︿•̀｡)</div>
                <div>ไม่พบผลลัพธ์การค้นหา</div>
                <div>ลองค้นหาด้วยเงื่อนไขอื่น</div>
              </div>
            )}
        </div>
      </div>
      <Backdrop
        open={isOpenFilter || openBookmarkModal || openAddBookmarkModal}
        onClose={handleCloseBackdrop}
        clickToClose={clickBackdropToClose}
      />
      {openBookmarkModal && (
        <BookmarkModal open={openBookmarkModal} onClose={handleClose} />
      )}
      {openAddBookmarkModal && (
        <AddBookmarkModal
          open={openAddBookmarkModal}
          onClose={(add: boolean) => {
            setAddMultipleBookmark(add);
            setOpenBookmarkModal(false);
            setOpenAddBookmarkModal(false);
            document.documentElement.style.overflowY = 'auto';
          }}
        />
      )}
      <div
        className={`lg:hidden fixed z-10 left-0 w-80 bg-white h-full transition-transform duration-300 ${
          isOpenFilter
            ? 'transform translate-x-0'
            : 'transform -translate-x-full'
        }`}
      >
        <div className="p-4 h-full overflow-y-auto">
          <Sidebar
            filterValues={filterValues}
            facultyOptions={facultyOptions}
            customStartTime={customStartTimeFilter}
            customEndTime={customEndTimeFilter}
            checkCustomTime={sendCustomTime}
            onClickFilterSearch={handleSearchActionAndClose}
          />
        </div>
      </div>
    </main>
  );
}
