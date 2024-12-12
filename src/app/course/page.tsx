'use client';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import Sidebar from './components/Sidebar';
import {
  CurriGroup,
  FacultyDto,
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
import { ListSubjectOrderBy, Order } from '@/enums';
import { fetchListFaculty } from '@/api/facultyApi';
import { CustomSearchBar, CustomSelect } from '@/components';

interface FilterGroup {
  courseCategory: string[];
  yearLevel: string;
  classDay: string[];
  classTime: string[];
}

const mockSelectOptions: SelectOption[] = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
];

export default function Course() {
  const [filter, setFilter] = useState<string>('');
  const [filterValues, setFilterValues] = useState<FilterGroup>({
    courseCategory: [],
    yearLevel: '',
    classDay: [],
    classTime: [],
  });

  const handleFilterChange = (group: string, value: string | string[]) => {
    setFilterValues((prevValues) => {
      const currentValue = prevValues[group as keyof FilterGroup];

      if (Array.isArray(value)) {
        return {
          ...prevValues,
          [group]: value,
        };
      } else {
        const updatedValues =
          Array.isArray(currentValue) && currentValue.includes(value)
            ? currentValue.filter((item) => item !== value)
            : [...(Array.isArray(currentValue) ? currentValue : []), value];

        return {
          ...prevValues,
          [group]: updatedValues,
        };
      }
    });
  };

  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [facultyOptions, setFacultyOptions] = useState<SelectOption[]>([]);

  const [selectedCurriGroup, setSelectedCurriGroup] = useState<CurriGroup>({
    faculty: '',
    department: '',
    curriculum: '',
    curriculumYear: '',
  });

  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [listSubjects, setListSubjects] = useState<SubjectDto[]>([]);
  const [listFaculty, setListFaculty] = useState<FacultyDto[]>([]);
  const { ref, inView } = useInView();

  const [openBookmarkModal, setOpenBookmarkModal] = useState(false);
  const handleOpen = () => setOpenBookmarkModal(true);
  const handleClose = () => setOpenBookmarkModal(false);

  const handleFacultyChange = (value: string) => {
    const selected = facultyOptions.find((option) => option.value === value);
    setSelectedFaculty(selected?.value || '');
    setSelectedFacultyObj(selected || null);

    setSelectedDepartment('');
    setSelectedCurriculum('');
    setSelectedCurriculumYear('');
  };

  const handleDepartmentChange = (value: string) => {
    const departmentOptions = selectedFacultyObj?.children || [];

    const selected = departmentOptions.find((option) => option.value === value);
    setSelectedDepartment(selected?.value || '');
    setSelectedDepartmentObj(selected || null);

    setSelectedCurriculum('');
    setSelectedCurriculumYear('');
  };

  const handleCurriculumChange = (value: string) => {
    const curriculumOptions = selectedDepartmentObj?.children || [];
    const selected = curriculumOptions.find((option) => option.value === value);

    setSelectedCurriculum(selected?.value || '');
    setSelectedCurriculumObj(selected || null);

    setSelectedCurriculumYear('');
  };

  const handleCurriculumYearChange = (value: string) => {
    const curriculumYearOptions = selectedCurriculumObj?.children || [];
    const selected = curriculumYearOptions.find(
      (option) => option.value === value,
    );

    setSelectedCurriculumYear(selected?.value || '');
  };

  useEffect(() => {
    const loadMoreSubjects = async () => {
      const last_id =
        listSubjects && listSubjects.length > 0
          ? listSubjects[listSubjects.length - 1].subject_id
          : '';
      const params: ListSubjectQueryParams = {
        semester: 1,
        year: 2564,
        limit: 10,
        cursor: last_id,
        direction: Order.ASC,
        orderBy: ListSubjectOrderBy.SUBJECT_ID,
      };
      const newSubjects = (await fetchListSubject(params))?.data || [];
      setListSubjects((subjects) => [...subjects, ...newSubjects]);
    };

    if (inView && initialLoadComplete) {
      loadMoreSubjects();
    }
  }, [inView, initialLoadComplete, listSubjects]);

  useEffect(() => {
    const loadSubjects = async () => {
      setLoading(true);
      try {
        const params: ListSubjectQueryParams = {
          semester: 1,
          year: 2564,
          limit: 10,
        };
        const data = (await fetchListSubject(params))?.data || [];
        setListSubjects(data);
      } catch (error) {
      } finally {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    };

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
        setListFaculty(data);
        setFacultyOptions(facultyOptions);
      } catch (error) {}
    };

    loadFaculty();
    loadSubjects();
  }, []);

  const handleCurriGroupChange = (curriGroup: CurriGroup) => {
    setSelectedCurriGroup(curriGroup);
    console.log('new curriGroup => ', curriGroup);
  };

  const handleSearchValueChange = (value: string) => {
    setSearchValue(value);
  };

  const handleSearchAction = () => {};

  const handleSelectValueChange = (value: string) => {
    setSelectedValue(value);
  };

  return (
    <main className="flex flex-row bg-gray-100 min-h-[calc(100vh-48px)] w-full">
      <div className="hidden lg:flex fixed min-w-60  bg-white h-full ">
        <Sidebar
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
        />{' '}
      </div>
      <div className="w-full">
        <CurriSelectContainer
          selectedCurriGroup={selectedCurriGroup}
          facultyOptions={facultyOptions}
          onCurriGroupChange={handleCurriGroupChange}
        />
        <div className="flex-grow bg-white max-w-3xl lg:max-w-none rounded-lg mx-auto lg:ml-64 lg:mr-4 my-4">
          <div className="flex flex-col sm:flex-row p-4 gap-4 justify-between">
            <div className="flex flex-grow">
              <CustomSearchBar
                onSearchValueChange={handleSearchValueChange}
                onSearchAction={handleSearchAction}
              />
            </div>
            <div className="flex flex-row gap-2 justify-between sm:ml-auto sm:gap-4">
              <CustomSelect
                onSelectedValueChange={handleSelectValueChange}
                selectOptions={mockSelectOptions}
                selectedValue={selectedValue}
              />
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{ minWidth: '115px' }}
                onClick={handleOpen}
              >
                วิชาที่บันทึก
              </Button>
              <BookmarkModal open={openBookmarkModal} onClose={handleClose} />
            </div>
          </div>
          <SubjectContainer subjectDetail={listSubjects} />
          <div ref={ref}>Loading...</div>
        </div>
      </div>
    </main>
  );
}
