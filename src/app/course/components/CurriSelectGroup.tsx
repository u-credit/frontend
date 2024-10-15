import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CustomSelectOutlined from './CustomSelectOutlined';
import { SelectOption } from '@/types';

interface CurriSelectGroupProps {
  selectedFaculty: string | number;
  selectedDepartment: string | number;
  selectedProgram: string | number;
  facultyOptions: SelectOption[];
  onFacultyChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onProgramChange: (value: string) => void;
}

export default function CurriSelectGroup({
  selectedFaculty,
  selectedDepartment,
  selectedProgram,
  facultyOptions,
  onFacultyChange,
  onDepartmentChange,
  onProgramChange,
}: CurriSelectGroupProps) {
  const selectedFacultyObj = facultyOptions.find(
    (faculty) => faculty.value === selectedFaculty,
  );

  const departmentOptions = selectedFacultyObj?.children || [];

  const selectedDepartmentObj = departmentOptions.find(
    (department) => department.value === selectedDepartment,
  );

  const programOptions = selectedDepartmentObj?.children || [];
  return (
    <div className="flex-grow bg-white max-w-3xl text-primary-400 lg:max-w-none rounded-b-lg mx-auto lg:ml-64 lg:mr-4 mb-4 p-4">
      <Accordion
        sx={{
          borderRadius: 2,
          borderWidth: 0,
          boxShadow: 'none',
          backgroundColor: 'white',
          '&.Mui-expanded': {
            margin: 0,
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{
            padding: 0,
            minHeight: 'unset',
            ' &.Mui-expanded': {
              minHeight: 'unset',
              margin: 0,
            },
            '& .MuiAccordionSummary-content': {
              margin: 0,
            },

            '& .MuiAccordionSummary-content.Mui-expanded': {
              margin: 0,
            },
          }}
        >
          <span className="text-primary-400">
            *เพื่อการแสดงผลรายละเอียดหมวดหมู่รายวิชาที่ละเอียดมากยิ่งขึ้น
            โปรดกรอกรายละเอียดหลักสูตรของคุณ
          </span>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 0 }}>
          <div className="flex flex-row gap-x-7 mt-4">
            <span className="font-semibold whitespace-nowrap content-center">
              หลักสูตรของคุณ
            </span>{' '}
            <CustomSelectOutlined
              onSelectedValueChange={onFacultyChange}
              selectOptions={facultyOptions}
              selectedValue={String(selectedFaculty)}
              label="คณะ"
            />
            <CustomSelectOutlined
              onSelectedValueChange={onDepartmentChange}
              selectOptions={departmentOptions}
              selectedValue={String(selectedDepartment)}
              label="ภาควิชา"
              disabled={!selectedFaculty}
            />
            <CustomSelectOutlined
              onSelectedValueChange={onProgramChange}
              selectOptions={programOptions}
              selectedValue={String(selectedProgram)}
              label="หลักสูตร"
              disabled={!selectedDepartment}
            />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
