import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CustomSelectOutlined from './CustomSelectOutlined';

interface CurriSelectGroupProps {
  selectedFaculty: string | null;
  selectedDepartment: string | null;
  selectedProgram: string | null;
}

export default function CurriSelectGroup({
  selectedFaculty,
  selectedDepartment,
  selectedProgram,
}: CurriSelectGroupProps) {
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
              onSelectedValueChange={function (value: string): void {
                throw new Error('Function not implemented.');
              }}
              selectOptions={[]}
              selectedValue={''}
              label="คณะ"
            />
            <CustomSelectOutlined
              onSelectedValueChange={function (value: string): void {
                throw new Error('Function not implemented.');
              }}
              selectOptions={[]}
              selectedValue={''}
              label="ภาควิชา"
              disabled={!selectedFaculty}
            />
            <CustomSelectOutlined
              onSelectedValueChange={function (value: string): void {
                throw new Error('Function not implemented.');
              }}
              selectOptions={[]}
              selectedValue={''}
              label="หลักสูตร"
              disabled={!selectedDepartment}
            />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
