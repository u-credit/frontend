import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { Button, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { CustomSelectOutlined } from '@/components';
import { SubjectCategory } from '@/enums';
interface FilterGroup {
  courseCategory: string[];
  yearLevel: string;
  classDay: string[];
  classTime: string[];
}

interface FilterProps {
  filterValues: FilterGroup;
  onFilterChange: (group: string, value: string | string[]) => void;
  onSelectCustomTime: (checked: boolean) => void;
  onCustomStartTimeChange: (customTime: string) => void;
  onCustomEndTimeChange: (customTime: string) => void;
  onClickFilterSearch: () => void;
}

export default function Sidebar({
  filterValues,
  onFilterChange,
  onSelectCustomTime,
  onCustomStartTimeChange,
  onCustomEndTimeChange,
  onClickFilterSearch,
}: FilterProps) {
  const [value, setValue] = useState<Dayjs | null>(
    dayjs().set('hour', 0).set('minute', 0),
  );

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

  const [state, setState] = useState({
    gilad: true,
    jason: false,
    antoine: false,
  });
  const handleChange = (event: { target: { name: any; checked: any } }) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleCheckboxChange = (group: string, value: string) => {
    onFilterChange(group, value);
  };

  const handleSelectAllClassDays = () => {
    const allClassDays = days.map((day) => day.key);
    const isAllSelected = allClassDays.every((day) =>
      filterValues.classDay.includes(day),
    );

    onFilterChange('classDay', isAllSelected ? [] : allClassDays);
  };

  const { gilad, jason, antoine } = state;

  const [customTimeChecked, setCustomTimeChecked] = useState(false);

  return (
    <div className="w-full flex flex-col gap-y-4 p-4 mb-10 overflow-y-auto ">
      <div className="flex items-center font-semibold	text-primary-400 space-x-2">
        <FilterAltOutlinedIcon color="primary" />
        <span>ค้นหาแบบละเอียด</span>
      </div>

      <FormGroup className="flex flex-col border-solid border-b-[1px] gap-2 pb-3">
        <span className="font-semibold">หมวดหมู่วิชา</span>
        {catagory.map(({ key, label, value }) => (
          <FormControlLabel
            key={key}
            control={
              <Checkbox
                checked={filterValues.courseCategory.includes(value)}
                onChange={() => handleCheckboxChange('courseCategory', value)}
                name={key}
                sx={{ padding: 0, color: 'grey.300', marginRight: '16px' }}
              />
            }
            label={
              <div>
                <span className="font-medium">{label}</span>
              </div>
            }
            sx={{ margin: 0 }}
          />
        ))}
      </FormGroup>

      <FormGroup className="gap-y-3 border-solid border-b-[1px] pb-3">
        <span className="font-semibold">ชั้นปี</span>
        <CustomSelectOutlined
          onSelectedValueChange={(value) =>
            handleCheckboxChange('yearLevel', value)
          }
          selectOptions={years}
          selectedValue={filterValues.yearLevel}
          label="ชั้นปี"
        />
      </FormGroup>
      <FormGroup className="gap-y-2 border-solid border-b-[1px] pb-3">
        <div className="flex flex-row justify-between items-center">
          <span className="font-semibold">วันที่เรียน</span>
          <span
            className="text-xs text-white cursor-pointer hover:bg-primary-400 active:bg-primary-200 bg-primary-300 rounded-md px-2 py-1"
            onClick={() => handleSelectAllClassDays()}
          >
            {filterValues.classDay.length === days.length
              ? 'ยกเลิกทั้งหมด'
              : 'เลือกทั้งหมด'}
          </span>{' '}
        </div>

        {days.map(({ key, label, value }) => (
          <FormControlLabel
            key={key}
            control={
              <Checkbox
                checked={filterValues.classDay.includes(value)}
                onChange={() => handleCheckboxChange('classDay', value)}
                name={key}
                sx={{ padding: 0, color: 'grey.300', marginRight: '16px' }}
              />
            }
            label={
              <div>
                <span className="font-medium">{label}</span>
              </div>
            }
            sx={{ margin: 0 }}
          />
        ))}
      </FormGroup>
      <FormGroup className="gap-y-2 border-solid border-b-[1px] pb-3">
        <span className="font-semibold">ช่วงเวลาที่เรียน</span>

        {times.map(({ key, label, value, timeRange }) => (
          <FormControlLabel
            key={key}
            control={
              <Checkbox
                checked={filterValues.classTime.includes(value)}
                onChange={() => handleCheckboxChange('classTime', value)}
                name={key}
                sx={{ padding: 0, color: 'grey.300', marginRight: '16px' }}
              />
            }
            label={
              <div>
                <span className="font-medium">{label}</span>
                <span className="block text-xs text-gray-500">{timeRange}</span>
              </div>
            }
            sx={{ margin: 0 }}
          />
        ))}
        <FormControlLabel
          control={
            <Checkbox
              checked={customTimeChecked}
              onChange={(e) => {
                setCustomTimeChecked(e.target.checked);
                onSelectCustomTime(e.target.checked);
              }}
              name="customTime"
              sx={{ padding: 0, color: 'grey.300', marginRight: '16px' }}
            />
          }
          label={
            <div>
              <span className="font-medium">อื่น ๆ</span>
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
                value={value}
                onChange={(newValue) => {
                  onCustomStartTimeChange(
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
                value={value}
                onChange={(newValue) => {
                  onCustomEndTimeChange(
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
        onClick={onClickFilterSearch}
      >
        search
      </Button>
    </div>
  );
}
