import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { CustomSelectOutlined } from '@/components';
interface FilterGroup {
  courseCategory: string[];
  yearLevel: string;
  classDay: string[];
  classTime: string[];
}

interface FilterProps {
  filterValues: FilterGroup;
  onFilterChange: (group: string, value: string | string[]) => void;
}

export default function Sidebar({ filterValues, onFilterChange }: FilterProps) {
  const [value, setValue] = useState<Dayjs | null>(dayjs().set('hour', 0).set('minute', 0));

  const years = [
    { key: '1', label: 'ปี 1', value: '1' },
    { key: '2', label: 'ปี 2', value: '2' },
    { key: '3', label: 'ปี 3', value: '3' },
    { key: '4', label: 'ปี 4', value: '4' },
    { key: '5', label: 'ปี 5', value: '5' },
  ];
  const days = [
    { key: 'mon', label: 'จันทร์', value: 'mon' },
    { key: 'tue', label: 'อังคาร', value: 'tue' },
    { key: 'wed', label: 'พุธ', value: 'wed' },
    { key: 'thu', label: 'พฤหัสบดี', value: 'thu' },
    { key: 'fri', label: 'ศุกร์', value: 'fri' },
    { key: 'sat', label: 'เสาร์', value: 'sat' },
    { key: 'sun', label: 'อาทิตย์', value: 'sun' },
  ];
  const times = [
    {
      key: 'morning',
      label: 'เช้า',
      value: 'morning',
      timeRange: '6:00 - 12:00',
    },
    {
      key: 'afternoon',
      label: 'บ่าย',
      value: 'afternoon',
      timeRange: '12:00 - 18:00',
    },
    {
      key: 'evening',
      label: 'เย็น',
      value: 'evening',
      timeRange: '18:00 - 21:00',
    },
    { key: 'night', label: 'ดึก', value: 'night', timeRange: '21:00 - 6:00' },
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
  const [customStartTime, setCustomStartTime] = useState('');
  const [customEndTime, setCustomEndTime] = useState('');

  const timeOptions = Array.from({ length: 24 }, (_, index) => {
    const hour = index.toString().padStart(2, '0');
    return { key: hour, label: `${hour}:00`, value: `${hour}:00` };
  });

  const handleCustomTimeChange = () => {
    console.log('Custom Time Selected:', customStartTime, customEndTime);
  };
  return (
    <div className="w-full flex flex-col gap-y-4 p-4 mb-10 overflow-y-auto ">
      <div className="flex items-center font-semibold	text-primary-400 space-x-2">
        <FilterAltOutlinedIcon color="primary" />
        <span>ค้นหาแบบละเอียด</span>
      </div>

      <FormGroup className="flex flex-col border-solid border-b-[1px] gap-2 pb-3">
        <span className="font-semibold">หมวดหมู่วิชา</span>
        <FormControlLabel
          control={
            <Checkbox
              checked={gilad}
              onChange={handleChange}
              name="gilad"
              sx={{
                padding: 0,
                color: 'grey.300',
                marginRight: '16px',
              }}
            />
          }
          label="วิชาศึกษาทั่วไป"
          sx={{ margin: 0 }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={jason}
              onChange={handleChange}
              name="jason"
              sx={{
                padding: 0,
                color: 'grey.300',
                marginRight: '16px',
              }}
            />
          }
          label="วิชาเฉพาะ"
          sx={{ margin: 0 }}
        />
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

        {days.map(({ key, label }) => (
          <FormControlLabel
            key={key}
            control={
              <Checkbox
                checked={filterValues.classDay.includes(key)}
                onChange={() => handleCheckboxChange('classDay', key)}
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

        {times.map(({ key, label, timeRange }) => (
          <FormControlLabel
            key={key}
            control={
              <Checkbox
                checked={filterValues.classTime.includes(key)}
                onChange={() => handleCheckboxChange('classTime', key)}
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
              onChange={(e) => setCustomTimeChecked(e.target.checked)}
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
                value={value}
                onChange={(newValue) => setValue(newValue)}
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
                value={value}
                onChange={(newValue) => setValue(newValue)}
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
    </div>
  );
}
