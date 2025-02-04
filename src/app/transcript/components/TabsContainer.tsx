import exp from 'constants';
import React, { use, useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { CustomSearchBar } from '@/components';
import SubjectContainerSummary from './SubjectContainerSummary';
import { SubjectTranscriptDto } from '@/Interfaces/transcript.interface';
import { SelectOption } from '@/types';

interface TabsContainerProps {
  transcript: SubjectTranscriptDto[];
  schedule: any;
}

const TabsContainer = ({
  transcript,
  schedule,
}: TabsContainerProps) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [searchValue, setSearchValue] = useState<string>('');
  const [semesterYear, setSemesterYear] = useState<
    { key: string; value: string; semester: string; year: string }[]
  >([
    { key: 'all', value: 'ทั้งหมด', semester: '', year: '' },
    { key: '2564/1', value: '2564/1', semester: '1', year: '2564' },
    { key: '2564/2', value: '2564/2', semester: '2', year: '2564' },
    { key: '2565/1', value: '2565/1', semester: '1', year: '2565' },
    { key: '2565/2', value: '2565/2', semester: '2', year: '2565' },
    { key: '2566/1', value: '2566/1', semester: '1', year: '2566' },
  ]);
  const [activeSemesterYear, setActiveSemesterYear] = useState<{
    key: string;
    value: string;
    semester: string;
    year: string;
  }>({ key: 'all', value: 'ทั้งหมด', semester: '', year: '' });
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSearchValueChange = (value: string) => setSearchValue(value);

  const handleSearchBar = () => {
    //fetct data
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
      <div className="max-w-[500px]">
        <CustomSearchBar
          onSearchValueChange={handleSearchValueChange}
          onSearchAction={handleSearchBar}
        />
      </div>
      <SubjectContainerSummary
        subjects={activeTab === 0 ? transcript : schedule}
        semester={activeSemesterYear.semester}
        year={activeSemesterYear.year}
        searchValue={searchValue}
      />
    </div>
  );
};
export default TabsContainer;
