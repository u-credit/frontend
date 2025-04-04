'use client';
import { Suspense, use, useCallback, useEffect, useRef, useState } from 'react';
import { Button, LinearProgress } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import Sidebar, { FilterGroup } from './components/Sidebar';
import {
  CurriGroup,
  CursorMetaDto,
  ListSubjectQueryParams,
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
import { ListSubjectOrderBy, Order, SubjectCategoryEnum } from '@/enums';
import { fetchListFaculty } from '@/api/facultyApi';
import { CustomSearchBar, CustomSelect, Loading } from '@/components';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/features/store';
import { setSemester, setYear } from '@/features/selectorValueSlice';
import TuneIcon from '@mui/icons-material/Tune';
import { fetchActiveSetting } from '@/features/admin/semesterSettingsSlice';
import CourseProvider, { useCourseContext } from '../contexts/CourseContext';
import {
  loadBookmarks,
  loadBookmarksApi,
  setBackup,
  updateBookmarksOnCurriChange,
} from '@/features/bookmark/bookmarkSlice';
import { addMultipleBookmarkApi } from '@/api/bookmarkApi';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import { formatFacultyOption, getAllBackupBookmarks } from '@/utils';
import AddBookmarkModal from './components/AddBookmarkModal';
import Backdrop from '@/components/Backdrop';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { setUserCurriGroupByCurriGroup } from '@/features/facultySlice';
import { updateUser } from '@/api/userApi';

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
  { label: '2567', value: '2567' },
];

export default function CourseWrapper() {
  return (
    <CourseProvider>
      <Suspense fallback={<Loading />}>
        <Course />
      </Suspense>
    </CourseProvider>
  );
}

function Course() {
  const dispatch = useDispatch<AppDispatch>();
  const { listSubjects, setListSubjects } = useCourseContext();
  const { semester, year } = useSelector(
    (state: RootState) => state.selectorValue,
  );
  const selectedCurriGroup = useSelector(
    (state: RootState) => state.faculty.userCurriGroup,
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
  const [sendSearchValue, setSendSearchValue] = useState<string>('');

  const [facultyOptions, setFacultyOptions] = useState<SelectOption[]>([]);
  // const [selectedCurriGroup, setSelectedCurriGroup] = useState<CurriGroup>({
  //   faculty: initSelectOption(),
  //   department: initSelectOption(),
  //   curriculum: initSelectOption(),
  //   curriculumYear: initSelectOption(),
  // });
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const { ref, inView } = useInView();
  const [openBookmarkModal, setOpenBookmarkModal] = useState(false);
  const [openAddBookmarkModal, setOpenAddBookmarkModal] = useState<
    boolean | null
  >(null);
  const [sendCustomTime, setSendCustomTime] = useState<boolean>(false);
  const [totalSearchSubject, setTotalSearchSubject] = useState<number | null>(
    null,
  );
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [changeFromDelete, setChangeFromDelete] = useState(false);
  const [clickBackdropToClose, setClickBackdropToClose] =
    useState(!isAuthenticated);
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
      const getCategory = (category: string[]): SubjectCategoryEnum => {
        if (category.length === 2) return SubjectCategoryEnum.ALL;
        else if (category.includes(SubjectCategoryEnum.GENERAL))
          return SubjectCategoryEnum.GENERAL;
        return SubjectCategoryEnum.MAJOR;
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
        isLoadMore ? lastSubject.categories?.length.toString() : '',
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
          // console.log('Fetch aborted (ไม่ใช่ error จริง)');
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
      setListSubjects,
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

  // useEffect(() => {
  //   if (userCurriGroup) {
  //     setSelectedCurriGroup(userCurriGroup);
  //   }
  // }, [userCurriGroup]);

  useEffect(() => {
    loadSubjects({ isLoadMore: false });
  }, [
    selectedSemester,
    selectedYear,
    selectedCurriGroup.faculty.value,
    selectedCurriGroup.department.value,
    selectedCurriGroup.curriculum.value,
    selectedCurriGroup.curriculumYear.value,
  ]);

  useEffect(() => {
    if (changeFromDelete) return;
    if (isFirstLoad) return;
    loadSubjects({ isLoadMore: false });
  }, [
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
  }, [filterValues, customStartTimeFilter, customEndTimeFilter, filterValues]);

  useEffect(() => {
    const initializeSettings = async () => {
      try {
        dispatch(fetchActiveSetting());
      } catch (error) {
        console.error('Error:', error);
      }
    };
    initializeSettings();
  }, []);

  const handleSearchValueChange = (value: string) => setSearchValue(value);

  const handleSearchBar = () => {
    loadSubjects({ isLoadMore: false });
    setSendSearchValue(searchValue);
  };

  useEffect(() => {
    if (searchValue === '') loadSubjects({ isLoadMore: false });
  }, [searchValue]);

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
  const handleApplyCurriGroup = async (curriGroup: CurriGroup) => {
    // setSelectedCurriGroup(
    //   curriGroup
    //     ? {
    //         faculty: curriGroup.faculty,
    //         department: curriGroup.department,
    //         curriculum: curriGroup.curriculum,
    //         curriculumYear: curriGroup.curriculumYear,
    //       }
    //     : {
    //         faculty: initSelectOption(),
    //         department: initSelectOption(),
    //         curriculum: initSelectOption(),
    //         curriculumYear: initSelectOption(),
    //       },
    // );

    await updateUser({
      facultyId: curriGroup.faculty.value,
      departmentId: curriGroup.department.value,
      curriculumId: curriGroup.curriculum.value,
      curriculumYear: curriGroup.curriculumYear.value,
    });
    dispatch(setUserCurriGroupByCurriGroup(curriGroup));
    dispatch(updateBookmarksOnCurriChange());
  };

  useEffect(() => {
    if (openAddBookmarkModal === true || addMultipleBookmark === null) return;
    const addBookmark = async () => {
      try {
        if (addMultipleBookmark) {
          await addMultipleBookmarkApi(getAllBackupBookmarks());
          setAddMultipleBookmark(false);
        }
      } catch (error) {}
    };

    if (isAuthenticated) {
      addBookmark();
      dispatch(setBackup(null));
      dispatch(loadBookmarksApi());
    } else {
      dispatch(loadBookmarks());
    }
  }, [
    dispatch,
    isAuthenticated,
    semester,
    year,
    addMultipleBookmark,
    openAddBookmarkModal,
  ]);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const backupBookmark = useSelector(
    (state: RootState) => state.bookmark.backup,
  );
  useEffect(() => {
    const login = searchParams.get('login');
    if (!login && backupBookmark === null) {
      setOpenAddBookmarkModal(false);
      setClickBackdropToClose(true);
    } else if (login) {
      if (backupBookmark === null) return;
      if (backupBookmark !== null) {
        setOpenAddBookmarkModal(true);
      } else {
        setOpenAddBookmarkModal(false);
      }
      const updatedSearchParams = new URLSearchParams(searchParams.toString());
      updatedSearchParams.delete('login');

      const newUrl = `${pathname}?${updatedSearchParams.toString()}`;
      router.replace(newUrl);
    }
  }, [pathname, router, searchParams, backupBookmark]);

  const handleCloseBackdrop = () => {
    setIsOpenFilter(false);
    setOpenBookmarkModal(false);
    setOpenAddBookmarkModal(false);
    document.documentElement.style.overflowY = 'auto';
  };

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
                value={searchValue}
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
            sendSearchValue={sendSearchValue}
            setSearchValue={setSearchValue}
            setSendSearchValue={setSendSearchValue}
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
        open={
          isOpenFilter || openBookmarkModal || openAddBookmarkModal === true
        }
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
