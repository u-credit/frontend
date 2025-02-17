import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { CustomSearchBar, CustomSelect } from '@/components';
import SubjectContainerSummary from './SubjectContainerSummary';
import { useSelector } from 'react-redux';
import { selectTranscripts } from '@/features/transcriptSlice';
import { SelectOption } from '@/types';

interface TabsContainerProps {}

const TabsContainer = ({}: TabsContainerProps) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [searchValue, setSearchValue] = useState<string>('');
  const [semester, setSemester] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [semesterYear, setSemesterYear] = useState<string>('all');
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSearchValueChange = (value: string) => setSearchValue(value);

  const handleSearchBar = () => {
    //fetct data
  };

  const transcriptSubject = useSelector(selectTranscripts);
  const uniqueSemesterYear: SelectOption[] = [
    { label: 'ทั้งหมด', value: 'all' },
  ];
  const seen = new Set();

  transcriptSubject.forEach((s) => {
    if (!s.semester || !s.year) return;
    const value = `${s.semester}/${s.year}`;
    if (!seen.has(value)) {
      seen.add(value);
      uniqueSemesterYear.push({
        label: value,
        value: value,
      });
    }
  });

  uniqueSemesterYear.sort((a, b) => {
    const [semesterA, yearA] = a.value.split('/').map(Number);
    const [semesterB, yearB] = b.value.split('/').map(Number);

    if (yearA === yearB) {
      return semesterA - semesterB;
    }
    return yearA - yearB;
  });

  const handleSelectSemesterYear = (value: string) => {
    const [semester, year] = value.split('/');
    setSemesterYear(value);
    setSemester(semester);
    setYear(year);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="inline">
        <Tabs
          value={activeTab}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{
            fontWeight: '600',
          }}
        >
          <Tab label="รายวิชาที่เคยลงทะเบียนเรียน" id="transcrip-tab" />
          <Tab label="รายวิชาจากตารางเรียน" id="schedule-tab" />
        </Tabs>
      </div>
      <div className="flex gap-x-5 max-w-[500px]">
        <CustomSearchBar
          onSearchValueChange={handleSearchValueChange}
          onSearchAction={handleSearchBar}
        />
        <CustomSelect
          onSelectedValueChange={handleSelectSemesterYear}
          selectOptions={uniqueSemesterYear}
          selectedValue={semesterYear}
          label="ภาคเรียน"
          sx={{
            width: '105px',
          }}
        />
      </div>
      <SubjectContainerSummary
        subjectFlag={activeTab === 0 ? 'transcript' : 'schedule'}
        semester={semester}
        year={year}
        searchValue={searchValue}
      />
    </div>
  );
};
export default TabsContainer;
