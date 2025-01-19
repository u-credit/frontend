import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { Button, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { CurriSelectGroup, CustomSelectOutlined } from '@/components';
import { SubjectCategory } from '@/enums';
import { CurriGroup } from '@/Interfaces';
import { initSelectOption, SelectOption } from '@/types';
import { ClearButon } from './ClearButton';
export interface FilterGroup {
  courseCategory: string[];
  yearLevel: SelectOption;
  classDay: string[];
  classTime: string[];
  faculty: SelectOption;
  department: SelectOption;
  curriculum: SelectOption;
}

interface FilterProps {
  filterValues: FilterGroup;
  facultyOptions: SelectOption[];
  customStartTime: string;
  customEndTime: string;
  checkCustomTime: boolean;
  onClickFilterSearch: (
    filterValues: FilterGroup,
    customStart: string,
    customEnd: string,
    customTime: boolean,
  ) => void;
}

export default function Sidebar({
  filterValues,
  facultyOptions,
  customStartTime,
  customEndTime,
  checkCustomTime,
  onClickFilterSearch,
}: FilterProps) {
  const catagory = [
    { key: '1', label: 'วิชาศึกษาทั่วไป', value: SubjectCategory.GENERAL },
    { key: '2', label: 'วิชาเฉพาะ', value: SubjectCategory.MAJOR },
  ];

  const years = [
    { key: '1', label: 'ปี 1', value: '1' },
    { key: '2', label: 'ปี 2', value: '2' },
    { key: '3', label: 'ปี 3', value: '3' },
    { key: '4', label: 'ปี 4', value: '4' },
    { key: '5', label: 'ปี 5', value: '5' },
  ];
  const days = [
    { key: '1', label: 'อาทิตย์', value: '1' },
    { key: '2', label: 'จันทร์', value: '2' },
    { key: '3', label: 'อังคาร', value: '3' },
    { key: '4', label: 'พุธ', value: '4' },
    { key: '5', label: 'พฤหัสบดี', value: '5' },
    { key: '6', label: 'ศุกร์', value: '6' },
    { key: '7', label: 'เสาร์', value: '7' },
  ];
  const times = [
    {
      key: 'morning',
      label: 'เช้า',
      value: '7:30-12:30',
      timeRange: '7:30 - 12:30',
    },
    {
      key: 'afternoon',
      label: 'บ่าย',
      value: '12:30-17:30',
      timeRange: '12:30 - 17:30',
    },
    {
      key: 'evening',
      label: 'เย็น',
      value: '17:30-22:30',
      timeRange: '17:30 - 22:30',
    },
    {
      key: 'night',
      label: 'ดึก',
      value: '22:30-00:00',
      timeRange: '22:30 - 00:00',
    },
  ];

  const [selectedCurriGroup, setSelectedCurriGroup] = useState<CurriGroup>({
    faculty: initSelectOption(),
    department: initSelectOption(),
    curriculum: initSelectOption(),
    curriculumYear: initSelectOption(),
  });

  const [selectedFilter, setSelectedFilter] = useState<FilterGroup>({
    courseCategory: [],
    yearLevel: {
      value: '',
      label: '',
    },
    classDay: [],
    classTime: [],
    faculty: initSelectOption(),
    department: initSelectOption(),
    curriculum: initSelectOption(),
  });

  const [selectedCustomStart, setSelectedCustomStart] = useState<string>('');
  const [selectedCustomEnd, setSelectedCustomEnd] = useState<string>('');
  const [sendErrorDepartment, setSendErrorDepartment] =
    useState<boolean>(false);
  const [sendErrorCurriculum, setSendErrorCurriculum] =
    useState<boolean>(false);
  const prevFilterValuesRef = useRef<FilterGroup>(filterValues);

  useEffect(() => {
    if (
      JSON.stringify(prevFilterValuesRef.current.curriculum) !==
        JSON.stringify(filterValues.curriculum) ||
      JSON.stringify(prevFilterValuesRef.current.faculty) !==
        JSON.stringify(filterValues.faculty) ||
      JSON.stringify(prevFilterValuesRef.current.department) !==
        JSON.stringify(filterValues.department)
    ) {
      setSelectedCurriGroup((prev) => ({
        ...prev,
        curriculum: filterValues.curriculum,
        faculty: filterValues.faculty,
        department: filterValues.department,
      }));
    }

    if (
      JSON.stringify(prevFilterValuesRef.current.courseCategory) !==
        JSON.stringify(filterValues.courseCategory) ||
      JSON.stringify(prevFilterValuesRef.current.yearLevel) !==
        JSON.stringify(filterValues.yearLevel) ||
      JSON.stringify(prevFilterValuesRef.current.classDay) !==
        JSON.stringify(filterValues.classDay) ||
      JSON.stringify(prevFilterValuesRef.current.classTime) !==
        JSON.stringify(filterValues.classTime)
    ) {
      setSelectedFilter((prev) => ({
        ...prev,
        courseCategory: filterValues.courseCategory,
        yearLevel: filterValues.yearLevel,
        classDay: filterValues.classDay,
        classTime: filterValues.classTime,
      }));
    }

    prevFilterValuesRef.current = filterValues;

    if (customStartTime != selectedCustomStart) {
      setSelectedCustomStart(customStartTime);
    }
    if (customEndTime != selectedCustomEnd) {
      setSelectedCustomEnd(customEndTime);
    }
    if (checkCustomTime != customTimeChecked) {
      setCustomTimeChecked(checkCustomTime);
    }
  }, [filterValues]);

  const handleSelectAllClassDays = () => {
    const allClassDays = days.map((day) => day.key);
    const isAllSelected = allClassDays.every((day) =>
      selectedFilter.classDay.includes(day),
    );
    handleFilterChange('classDay', isAllSelected ? [] : allClassDays);
  };

  const [customTimeChecked, setCustomTimeChecked] = useState(false);

  useEffect(() => {
    if (customStartTime != '' || customEndTime != '') {
      setCustomTimeChecked(true);
    } else {
      setCustomTimeChecked(false);
    }
  }, [customStartTime, customEndTime]);

  useEffect(() => {
    handleFilterChange('faculty', selectedCurriGroup.faculty);
    handleFilterChange('department', selectedCurriGroup.department);
    handleFilterChange('curriculum', selectedCurriGroup.curriculum);
    if (
      selectedCurriGroup.faculty.value &&
      selectedCurriGroup.department.value
    ) {
      setSendErrorDepartment(false);
    }
    if (
      selectedCurriGroup.faculty.value &&
      selectedCurriGroup.department.value &&
      selectedCurriGroup.curriculum.value
    ) {
      setSendErrorCurriculum(false);
    }
  }, [selectedCurriGroup]);

  const handleFilterChange = (
    group: string,
    value: SelectOption | string | string[],
  ) => {
    setSelectedFilter((prevValues) => {
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

  const handleOnClick = () => {
    if (selectedFilter.faculty.value && !selectedFilter.department.value) {
      setSendErrorDepartment(true);
    } else if (
      selectedFilter.department.value &&
      !selectedFilter.curriculum.value
    ) {
      setSendErrorCurriculum(true);
    } else {
      onClickFilterSearch(
        selectedFilter,
        selectedCustomStart,
        selectedCustomEnd,
        customTimeChecked,
      );
    }
  };

  const handleCheckCustomTime = () => {
    const toggle = !customTimeChecked;
    setCustomTimeChecked(toggle);
    if (customStartTime === '' && customEndTime === '') {
      setSelectedCustomStart('00:00');
      setSelectedCustomEnd('00:00');
    }
    if (!toggle) {
      setSelectedCustomStart('');
      setSelectedCustomEnd('');
    }
  };

  return (
    <div className="w-full flex flex-col gap-y-4 p-4 mb-10 overflow-y-auto ">
      <div className="flex items-center font-semibold	text-primary-400 space-x-2">
        <FilterAltOutlinedIcon color="primary" />
        <span>ค้นหาแบบละเอียด</span>
      </div>
      <FormGroup className="flex flex-col border-solid border-b-[1px] gap-2 pb-3">
        <div className="flex flex-row justify-between items-end">
          <span className="font-semibold">หมวดหมู่วิชา</span>
          <ClearButon
            onClick={() => {
              setSelectedFilter((prev) => {
                return {
                  ...prev,
                  courseCategory: [],
                };
              });
            }}
          />
        </div>
        {catagory.map(({ key, label, value }) => (
          <FormControlLabel
            key={key}
            control={
              <Checkbox
                checked={selectedFilter.courseCategory.includes(value)}
                onChange={() => handleFilterChange('courseCategory', value)}
                name={key}
                sx={{ padding: 0, color: 'grey.300', marginRight: '16px' }}
              />
            }
            label={
              <div>
                <span className="font-regular">{label}</span>
              </div>
            }
            sx={{ margin: 0 }}
          />
        ))}
      </FormGroup>
      <FormGroup className="gap-y-3 border-solid border-b-[1px] pb-3">
        <div className="flex flex-row justify-between items-end">
          <span className="font-semibold">หลักสูตร</span>
          <ClearButon
            onClick={() => {
              setSelectedCurriGroup({
                faculty: initSelectOption(),
                department: initSelectOption(),
                curriculum: initSelectOption(),
                curriculumYear: initSelectOption(),
              });
              setSelectedFilter((prev) => {
                return {
                  ...prev,
                  yearLevel: initSelectOption(),
                };
              });
              setSendErrorDepartment(false);
              setSendErrorCurriculum(false);
            }}
          />
        </div>
        <CurriSelectGroup
          selectedCurriGroup={selectedCurriGroup}
          setSelectedCurriGroup={setSelectedCurriGroup}
          facultyOptions={facultyOptions}
          showCurriculumYear={false}
          errorDepartment={sendErrorDepartment}
          errorCurriculum={sendErrorCurriculum}
        />
        <CustomSelectOutlined
          onSelectedValueChange={(value) =>
            handleFilterChange('yearLevel', value)
          }
          selectOptions={years}
          selectedValue={selectedFilter.yearLevel}
          label="ชั้นปี"
        />
      </FormGroup>
      <FormGroup className="gap-y-2 border-solid border-b-[1px] pb-3">
        <div className="flex flex-row justify-between items-center">
          <span className="font-semibold">วันที่เรียน</span>
          {/* <span
            className="text-xs text-white cursor-pointer hover:bg-primary-400 active:bg-primary-200 bg-primary-300 rounded-md px-2 py-1"
            onClick={() => handleSelectAllClassDays()}
          >
            {selectedFilter.classDay.length === days.length
              ? 'ยกเลิกทั้งหมด'
              : 'เลือกทั้งหมด'}
          </span> */}
          <Button
            variant="contained"
            sx={{
              minWidth: '20px',
              height: '20px',
              padding: '4px',
              backgroundColor: 'primary.100',
              color: 'primary.300',
              '.MuiButton-startIcon': {
                margin: 0,
              },
              '&:hover': {
                backgroundColor: 'primary.100',
                color: 'primary.400',
              },
            }}
            onClick={handleSelectAllClassDays}
          >
            {selectedFilter.classDay.length === days.length
              ? 'ล้าง'
              : 'เลือกทั้งหมด'}
          </Button>
        </div>

        {days.map(({ key, label, value }) => (
          <FormControlLabel
            key={key}
            control={
              <Checkbox
                checked={selectedFilter.classDay.includes(value)}
                onChange={() => handleFilterChange('classDay', value)}
                name={key}
                sx={{
                  padding: 0,
                  // paddingTop: 0.4,
                  color: 'grey.300',
                  marginRight: '16px',
                }}
              />
            }
            label={
              <div>
                <span className="font-regular">{label}</span>
              </div>
            }
            sx={{ margin: 0 }}
          />
        ))}
      </FormGroup>
      <FormGroup className="gap-y-2 border-solid border-b-[1px] pb-3">
        <div className="flex flex-row justify-between items-end">
          <span className="font-semibold">ช่วงเวลาที่เรียน</span>
          <ClearButon
            onClick={() => {
              setSelectedFilter((prev) => {
                return {
                  ...prev,
                  classTime: [],
                };
              });
              setCustomTimeChecked(false);
              setSelectedCustomStart('');
              setSelectedCustomEnd('');
            }}
          />
        </div>

        {times.map(({ key, label, value, timeRange }) => (
          <FormControlLabel
            key={key}
            control={
              <Checkbox
                checked={selectedFilter.classTime.includes(value)}
                onChange={() => handleFilterChange('classTime', value)}
                name={key}
                sx={{
                  padding: 0,
                  // paddingTop: 0.4,
                  color: 'grey.300',
                  marginRight: '16px',
                }}
              />
            }
            label={
              <div>
                <span className="font-regular ">
                  {label}
                  <span className=" text-gray-600"> ({timeRange})</span>
                </span>
                {/* <span className="block text-xs text-gray-500">{timeRange}</span> */}
              </div>
            }
            sx={{ margin: 0 }}
          />
        ))}
        <FormControlLabel
          control={
            <Checkbox
              checked={customTimeChecked}
              onChange={handleCheckCustomTime}
              name="customTime"
              sx={{ padding: 0, color: 'grey.300', marginRight: '16px' }}
            />
          }
          label={
            <div>
              <span className="font-regular">อื่น ๆ</span>
            </div>
          }
          sx={{ margin: 0 }}
        />
        <div className="flex gap-x-2 mt-1">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={['TimePicker', 'TimePicker']}
              sx={{
                '&.MuiStack-root': {
                  paddingBottom: '1px',
                },
              }}
            >
              <TimePicker
                label="เริ่ม"
                disabled={!customTimeChecked}
                value={
                  selectedCustomStart
                    ? dayjs(selectedCustomStart, 'HH:mm')
                    : dayjs().set('hour', 0).set('minute', 0)
                }
                onChange={(newValue) => {
                  setSelectedCustomStart(
                    newValue ? newValue.format('HH:mm') : '',
                  );
                }}
                ampm={false}
                sx={{
                  width: '95px',
                  '&.MuiFormControl-root': {
                    minWidth: 'unset',
                  },
                  '& .MuiInputBase-input': {
                    padding: '8px 0 8px 12px',
                    textAlign: 'center',
                  },
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                  },
                  '& .MuiInputAdornment-root': {
                    marginLeft: '0',
                  },
                  '& .MuiSvgIcon-root': {
                    width: '20px',
                    height: '20px',
                    padding: '0px',
                  },
                }}
              />
              <TimePicker
                label="สิ้นสุด"
                disabled={!customTimeChecked}
                value={
                  selectedCustomEnd
                    ? dayjs(selectedCustomEnd, 'HH:mm')
                    : dayjs().set('hour', 0).set('minute', 0)
                }
                onChange={(newValue) => {
                  setSelectedCustomEnd(
                    newValue ? newValue.format('HH:mm') : '',
                  );
                }}
                ampm={false}
                sx={{
                  width: '95px',
                  '&.MuiFormControl-root': {
                    minWidth: 'unset',
                  },
                  '& .MuiInputBase-input': {
                    padding: '8px 0 8px 12px',
                    textAlign: 'center',
                  },
                  '& .MuiInputBase-root': {
                    borderRadius: '8px',
                  },
                  '& .MuiInputAdornment-root': {
                    marginLeft: '0',
                  },
                  '& .MuiSvgIcon-root': {
                    width: '20px',
                    height: '20px',
                    padding: '0px',
                  },
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>
      </FormGroup>
      <Button
        variant="contained"
        sx={{ minWidth: '115px' }}
        onClick={handleOnClick}
      >
        ค้นหา
      </Button>
    </div>
  );
}
