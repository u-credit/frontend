import React, { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { CustomSearchBar, CustomSelect } from '@/components';
import SubjectContainerSummary from './SubjectContainerSummary';
import { useSelector } from 'react-redux';
import { selectTranscripts } from '@/features/transcriptSlice';
import { SelectOption } from '@/types';
import { RootState } from '@/features/store';
import { useSummaryContext } from '@/app/contexts/SummaryContext';
import { useTheme } from '@mui/material';

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
  const [semesterYearOptions, setSemesterYearOptions] = useState<
    SelectOption[]
  >([{ label: 'ทั้งหมด', value: 'all' }]);

  const schedule = useSelector((state: RootState) => state.schedule);

  useEffect(() => {
    setSemesterYear('all');
    setSemester('');
    setYear('');
    const seen = new Set();
    const uniqueSemesterYear: SelectOption[] = [
      { label: 'ทั้งหมด', value: 'all' },
    ];
    if (activeTab === 0) {
      transcriptSubject?.forEach((s) => {
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
    } else {
      schedule.items?.forEach((s) => {
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
    }

    uniqueSemesterYear.sort((a, b) => {
      const [semesterA, yearA] = a.value.split('/').map(Number);
      const [semesterB, yearB] = b.value.split('/').map(Number);

      if (yearA === yearB) {
        return semesterA - semesterB;
      }
      return yearA - yearB;
    });

    setSemesterYearOptions(uniqueSemesterYear);
  }, [transcriptSubject, activeTab, schedule]);

  const handleSelectSemesterYear = (value: string) => {
    const [semester, year] = value.split('/');
    setSemesterYear(value);
    setSemester(semester);
    setYear(year);
  };

  const { tableData } = useSummaryContext();
  const [activeCategoryTab, setActiveCategoryTab] = useState(0);
  const handleCategoryChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveCategoryTab(newValue);
  };
  const { breakpoints } = useTheme();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row gap-5">
        {/* default */}
        <div className="tablet:flex bg-gray-100">
          <Tabs
            value={activeCategoryTab}
            onChange={handleCategoryChange}
            aria-label="subject tabs"
            orientation="vertical"
            variant="scrollable"
            sx={{
              fontWeight: '600',
              marginTop: '60px',
              [breakpoints.down('tablet')]: {
                display: 'none',
              },
            }}
          >
            <Tab
              label="ทั้งหมด"
              id="all-tab"
              sx={{
                bgcolor: activeCategoryTab !== 0 ? 'grey.100' : 'transparent!',
              }}
            />
            {tableData.map((cat, index) => (
              <Tab
                key={cat.id}
                label={cat.name}
                id={`tab-${index + 1}`}
                sx={{
                  bgcolor:
                    activeCategoryTab !== cat.id ? 'grey.100' : 'transparent!',
                }}
              />
            ))}
            <Tab
              label="ไม่ตรงหลักสูตร"
              id="unmatched-tab"
              sx={{
                bgcolor:
                  activeCategoryTab !== tableData.length + 1
                    ? 'grey.100'
                    : 'transparent!',
              }}
            />
          </Tabs>
        </div>
        <div className="flex flex-col gap-3 pt-5 w-full">
          <div className="flex flex-col gap-y-5 lg:flex-row lg:gap-y-0 items-center justify-between">
            <Tabs
              value={activeTab}
              onChange={handleChange}
              aria-label="basic tabs example"
              sx={{
                fontWeight: '600',
                width: '100%',
              }}
              variant="scrollable"
            >
              <Tab
                label="รายวิชาที่เคยลงทะเบียนเรียน"
                sx={{
                  [breakpoints.down('tablet')]: {
                    bgcolor: activeTab !== 0 ? 'grey.100' : 'transparent!',
                  },
                }}
                id="transcrip-tab"
              />
              <Tab
                label="รายวิชาจากตารางเรียน"
                sx={{
                  [breakpoints.down('tablet')]: {
                    bgcolor: activeTab !== 1 ? 'grey.100' : 'transparent!',
                  },
                }}
                id="schedule-tab"
              />
            </Tabs>

            {/* mobile */}
            <Tabs
              value={activeCategoryTab}
              onChange={handleCategoryChange}
              aria-label="subject tabs"
              variant="scrollable"
              sx={{
                fontWeight: '600',
                [breakpoints.up('tablet')]: {
                  display: 'none',
                },
                width: '100%',
              }}
            >
              <Tab label="ทั้งหมด" id="all-tab" />
              {tableData.map((cat, index) => (
                <Tab key={cat.id} label={cat.name} id={`tab-${index + 1}`} />
              ))}
              <Tab label="ไม่ตรงหลักสูตร" id="unmatched-tab" />
            </Tabs>

            <div className="flex gap-x-2 w-full">
              <div className="flex lg:grow lg:justify-end w-full">
                <CustomSearchBar
                  onSearchValueChange={handleSearchValueChange}
                  onSearchAction={handleSearchBar}
                  sx={{
                    width: '100%',
                    [breakpoints.down('tablet')]: {
                      minWidth: 'none',
                      maxWidth: 'none',
                    },
                    [breakpoints.up('tablet')]: {
                      maxWidth: '320px',
                      minWidth: '100%',
                    },
                  }}
                />
              </div>
              <CustomSelect
                onSelectedValueChange={handleSelectSemesterYear}
                selectOptions={semesterYearOptions}
                selectedValue={semesterYear}
                label="ภาคเรียน"
                sx={{
                  minWidth: '105px',
                }}
              />
            </div>
          </div>

          <SubjectContainerSummary
            subjectFlag={activeTab === 0 ? 'transcript' : 'schedule'}
            semester={semester}
            year={year}
            searchValue={searchValue}
            activeCategoryTab={activeCategoryTab}
          />
        </div>
      </div>
    </div>
  );
};
export default TabsContainer;
