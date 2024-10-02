'use client';
import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormGroup,
  Typography,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import Sidebar from './components/Sidebar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ListSubjectQueryParams, PageDto, SubjectDto } from '@/Interfaces';
import { fetchListSubject } from '@/api/subjectApi';
import { SelectOption } from '@/types';
import {
  BookmarkModal,
  CurriSelectGroup,
  CustomSearchBar,
  CustomSelect,
  SubjectContainer,
} from './components';

import { useInView } from 'react-intersection-observer';
import { ListSubjectOrderBy, Order } from '@/enums';

const mockSelectOptions: SelectOption[] = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
];

export default function Course() {
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<SelectOption[]>([
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
  ]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [listSubjects, setListSubjects] = useState<SubjectDto[]>([]);
  const { ref, inView } = useInView();

  const [openBookmarkModal, setOpenBookmarkModal] = useState(false);
  const handleOpen = () => setOpenBookmarkModal(true);
  const handleClose = () => setOpenBookmarkModal(false);

  useEffect(() => {
    // is meta should be replace?
    const loadMoreSubjects = async () => {
      console.log('Load more users');
      const last_id =
        listSubjects && listSubjects.length > 0
          ? listSubjects[listSubjects.length - 1].subject_id
          : '';
      console.log('last_id', last_id);
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
      // Check if initial load is complete
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
        console.log('finally', listSubjects);
      }
    };

    loadSubjects();
  }, []);

  // Handler to update search value
  const handleSearchValueChange = (value: string) => {
    setSearchValue(value);
  };

  // Optional: Function to handle search action, like pressing Enter
  const handleSearchAction = () => {
    console.log('Final Search Value:', searchValue);
    // Perform search or any other action here
  };

  const handleSelectValueChange = (value: string) => {
    setSelectedValue(value);
    console.log('Selected Value:', value);
  };

  return (
    <main className="flex flex-row bg-gray-100 min-h-[calc(100vh-48px)] w-full">
      <div className="hidden lg:flex fixed min-w-60  bg-white h-full ">
        <Sidebar />
      </div>
      <div className="w-full">
        <CurriSelectGroup
          selectedFaculty={''}
          selectedDepartment={''}
          selectedProgram={''}
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
