import { formatCategory, formatThaiDay } from '@/utils';
import { Chip } from '@mui/material';
import { FilterGroup } from './Sidebar';
import { initSelectOption } from '@/types';

interface FilterRowProps {
  totalSearchSubject: number;
  filterValues: FilterGroup;
  setFilterValues: React.Dispatch<React.SetStateAction<FilterGroup>>;
  customStartTimeFilter: string;
  customEndTimeFilter: string;
  setCustomStartTimeFilter: React.Dispatch<React.SetStateAction<string>>;
  setCustomEndTimeFilter: React.Dispatch<React.SetStateAction<string>>;
  handleDeleteFilter: (group: string, value: string) => void;
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
}: FilterRowProps) => {
  return (
    <div className="flex items-center px-4 gap-2">
      <div>ค้นพบ {totalSearchSubject} วิชา</div>
      {filterValues.courseCategory.map((cat) => (
        <Chip
          key={cat}
          label={formatCategory(cat)}
          onDelete={() => handleDeleteFilter('courseCategory', cat)}
          color="primary"
          variant="outlined"
        />
      ))}
      {filterValues.faculty.value ? (
        <Chip
          label={filterValues.faculty.label}
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
      ) : null}
      {filterValues.department.value ? (
        <Chip
          label={filterValues.department.label}
          onDelete={() => {
            setFilterValues((prevValues) => ({
              ...prevValues,
              department: initSelectOption(),
              curriculum: initSelectOption(),
            }));
          }}
          color="primary"
          variant="outlined"
        />
      ) : null}
      {filterValues.curriculum.value ? (
        <Chip
          label={filterValues.curriculum.label}
          onDelete={() => {
            setFilterValues((prevValues) => ({
              ...prevValues,
              curriculum: initSelectOption(),
            }));
          }}
          color="primary"
          variant="outlined"
        />
      ) : null}
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
      {filterValues.classTime.map(
        (time) => (
          console.log(time),
          (
            <Chip
              key={time}
              label={time}
              onDelete={() => handleDeleteFilter('classTime', time)}
              color="primary"
              variant="outlined"
            />
          )
        ),
      )}
      {customStartTimeFilter && customEndTimeFilter ? (
        <Chip
          label={customStartTimeFilter + '-' + customEndTimeFilter}
          onDelete={() => {
            setCustomStartTimeFilter('');
            setCustomEndTimeFilter('');
          }}
          color="primary"
          variant="outlined"
        />
      ) : null}
    </div>
  );
};

export default FilterRow;
