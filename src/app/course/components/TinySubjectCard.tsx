import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  Rating,
  Typography,
} from '@mui/material';
import { SubjectDetail } from '../../../Interfaces';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CustomButton from './CustomButton';
import CustomSelect from './CustomSelect';
import { useState } from 'react';
import { SelectOption } from '@/types';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CustomSectionChip from './CustomSectionChip';
import CustomTable from './CustomTable';
import StarIcon from '@mui/icons-material/Star';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface SubjectCardProps {
  subjectDetail: SubjectDetail;
}

const mockSelectOptions: SelectOption[] = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
];

export default function SubjectCard({ subjectDetail }: SubjectCardProps) {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [isToggled, setIsToggled] = useState(false);
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleSelectValueChange = (value: string) => {
    setSelectedValue(value);
    // console.log('Selected Value:', value);
  };

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  return (
    <div className="relative">
      <div className="bg-white rounded-lg border-[1px] p-4 border-gray-300 pb-[70px]">
        {/* <Typography>Expanded by default</Typography> */}
        <div className="flex flex-col">
          <div id="subject-card-header" className="flex flex-col gap-[10px]">
            <div id="row-1" className="flex flex-wrap gap-6 items-center">
              <div className="font-bold text-lg">01076011</div>
              <div className="font-bold text-lg">Operationg Systems</div>
              <Chip
                label="วิชาเฉพาะ-แกน-วิศวกรรม"
                size="small"
                variant="outlined"
              />
            </div>
            <div id="row-2" className="flex flex-row gap-3">
              <div>3 หน่วยกิต</div>
              <Rating
                name="half-rating-read"
                defaultValue={2.5}
                precision={0.5}
                readOnly
                emptyIcon={<StarIcon fontSize="inherit" />}
                sx={{
                  '& .MuiRating-iconEmpty': {
                    color: 'grey.200',
                  },
                  '& .MuiRating-iconFilled': {
                    color: 'primary.400',
                  },
                }}
              />
            </div>
            <div id="row-3" className="flex flex-wrap gap-x-2 gap-y-1">
              <CustomSectionChip day={0} sec="19" />
              <CustomSectionChip day={1} sec="19" />
              <CustomSectionChip day={2} sec="19" />
              <CustomSectionChip day={3} sec="19" />
              <CustomSectionChip day={4} sec="19" />
              <CustomSectionChip day={5} sec="19" />
              <CustomSectionChip day={6} sec="19" />
            </div>
          </div>
        </div>
      </div>
      <div
        id="button-area"
        className="absolute flex items-end justify-between px-4 w-full bottom-4"
      >
        <span className="text-sm">เปิดในเทอมนี้</span>
        <div className="flex space-x-2">
          <CustomSelect
            onSelectedValueChange={handleSelectValueChange}
            selectOptions={mockSelectOptions}
            selectedValue={selectedValue}
          />
          <Button
            variant="contained"
            startIcon={isToggled ? <CheckIcon /> : <AddIcon />}
            sx={{
              // minWidth: '115px',
              backgroundColor: isToggled ? 'white' : undefined,
              color: isToggled ? 'primary.main' : undefined,
              borderStyle: 'solid',
              borderWidth: 1,
              borderColor: 'primary.main',
              '&:hover': {
                backgroundColor: isToggled ? 'primary.100' : undefined,
              },
            }}
            onClick={handleToggle}
          >
            บันทึก
          </Button>
        </div>
      </div>
    </div>
  );
}
