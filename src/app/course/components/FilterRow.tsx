import { formatCategory, formatThaiDay, isDefaultFilterValues } from '@/utils';
import { Chip } from '@mui/material';
import { FilterGroup } from './Sidebar';
import { initSelectOption } from '@/types';
import { ClearButon } from './ClearButton';

interface FilterRowProps {
  totalSearchSubject: number;
  filterValues: FilterGroup;
  setFilterValues: React.Dispatch<React.SetStateAction<FilterGroup>>;
  customStartTimeFilter: string;
  customEndTimeFilter: string;
  setCustomStartTimeFilter: React.Dispatch<React.SetStateAction<string>>;
  setCustomEndTimeFilter: React.Dispatch<React.SetStateAction<string>>;
  handleDeleteFilter: (group: string, value: string) => void;
  resetFilter: () => void;
  setSendCustomTime: React.Dispatch<React.SetStateAction<boolean>>;
  setChangeFromDelete: React.Dispatch<React.SetStateAction<boolean>>;
  sendSearchValue: string;
  setSendSearchValue: React.Dispatch<React.SetStateAction<string>>;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}

export const FilterRow = ({
  totalSearchSubject,
  filterValues,
  setFilterValues,
  customStartTimeFilter,
  customEndTimeFilter,
  setCustomStartTimeFilter,
  setCustomEndTimeFilter,
  handleDeleteFilter,
  resetFilter,
  setSendCustomTime,
  setChangeFromDelete,
  sendSearchValue,
  setSendSearchValue,
  setSearchValue,
}: FilterRowProps) => {
  return (
    <div className="flex flex-col px-4 gap-2">
      <div className="flex w-full justify-between items-end">
        <div>ค้นพบ {totalSearchSubject} วิชา</div>
        {!isDefaultFilterValues(filterValues) || sendSearchValue ? (
          <ClearButon
            clearAll={true}
            onClick={() => {
              resetFilter();
              setSendCustomTime(false);
              setCustomStartTimeFilter('');
              setCustomEndTimeFilter('');
              setSendSearchValue('');
              setSearchValue('');
              setChangeFromDelete(true);
            }}
          />
        ) : // <div
        //   onClick={() => {
        //     resetFilter();
        //     setSendCustomTime(false);
        //     setCustomStartTimeFilter('');
        //     setCustomEndTimeFilter('');
        //     setChangeFromDelete(true);
        //   }}
        //   className="underline text-primary-400 hover:text-primary-200 hover:cursor-pointer active:text-primary-500 text-nowrap transition-colors duration-300 ease-in-out"
        // >
        //   ล้างทั้งหมด
        // </div>
        null}
      </div>
      <div className="flex items-center flex-wrap gap-2 ">
        {sendSearchValue && (
          <Chip
            label={sendSearchValue}
            onDelete={() => {
              setSendSearchValue('');
              setSearchValue('');
            }}
            color="primary"
            variant="outlined"
          />
        )}
        {filterValues.courseCategory.map((cat) => (
          <Chip
            key={cat}
            label={formatCategory(cat)}
            onDelete={() => handleDeleteFilter('courseCategory', cat)}
            color="primary"
            variant="outlined"
          />
        ))}
        {filterValues.faculty.value &&
          filterValues.department.value &&
          filterValues.curriculum.value && (
            <Chip
              label={
                filterValues.faculty.label +
                ' - ' +
                filterValues.department.label +
                ' - ' +
                filterValues.curriculum.label
              }
              onDelete={() => {
                setFilterValues((prevValues) => ({
                  ...prevValues,
                  faculty: initSelectOption(),
                  department: initSelectOption(),
                  curriculum: initSelectOption(),
                }));
              }}
              color="primary"
              variant="outlined"
            />
          )}
        {filterValues.yearLevel.value ? (
          <Chip
            label={filterValues.yearLevel.label}
            onDelete={() => {
              setFilterValues((prevValues) => ({
                ...prevValues,
                yearLevel: initSelectOption(),
              }));
            }}
            color="primary"
            variant="outlined"
          />
        ) : null}
        {filterValues.classDay.map((day) => (
          <Chip
            key={day}
            label={formatThaiDay(Number(day))}
            onDelete={() => handleDeleteFilter('classDay', day)}
            color="primary"
            variant="outlined"
          />
        ))}
        {filterValues.classTime.map((time) => (
          <Chip
            key={time}
            label={time}
            onDelete={() => handleDeleteFilter('classTime', time)}
            color="primary"
            variant="outlined"
          />
        ))}
        {customStartTimeFilter && customEndTimeFilter ? (
          <Chip
            label={customStartTimeFilter + '-' + customEndTimeFilter}
            onDelete={() => {
              setSendCustomTime(false);
              setCustomStartTimeFilter('');
              setCustomEndTimeFilter('');
              setChangeFromDelete(true);
            }}
            color="primary"
            variant="outlined"
          />
        ) : null}
      </div>
    </div>
  );
};

export default FilterRow;
