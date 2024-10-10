import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  Rating,
  Typography,
} from '@mui/material';
import { SubjectDetail, SubjectDto } from '../../../Interfaces';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CustomButton from './CustomButton';
import CustomSelect from './CustomSelect';
import { useEffect, useState } from 'react';
import { SelectOption } from '@/types';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CustomSectionChip from './CustomSectionChip';
import CustomTable from './CustomTable';
import StarIcon from '@mui/icons-material/Star';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { stripHtmlTags } from '@/utils';
import { useRouter } from 'next/navigation';

interface SubjectCardProps {
  subjectDetail: SubjectDto;
}

const mockSelectOptions: SelectOption[] = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
];

export default function SubjectCard({ subjectDetail }: SubjectCardProps) {
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [isToggled, setIsToggled] = useState(false);
  const [expanded, setExpanded] = useState<boolean>(false);

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const [daySection, setDaySection] = useState<string[]>(new Array(8).fill(''));

  const handleSelectValueChange = (value: string) => {
    setSelectedValue(value);
    console.log('Selected Value:', value);
  };

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  const handleAccordionChange = (
    event: React.SyntheticEvent,
    isExpanded: boolean,
  ) => {
    setExpanded(isExpanded);
  };

  const handleExpanded = (event: React.MouseEvent) => {
    // Prevent the accordion from expanding when clicking the summary
    event.stopPropagation();
    setIsExpanded((prevExpanded) => !prevExpanded);
  };

  const handleMoreDetail = () => {
    console.log('Accordion Clicked');
    router.push(`/course/${subjectDetail.subject_id}`);
  };

  useEffect(() => {
    if (subjectDetail.teach_table) {
      const daySection = new Array(8).fill('');
      subjectDetail.teach_table.forEach((table) => {
        daySection[table.teach_day] += table.section + ' ';
      });
      setDaySection(daySection);
    }
  }, [subjectDetail]);

  return (
    <div className="relative group">
      <Accordion
        expanded={isExpanded}
        onClick={handleExpanded}
        className="group-hover:bg-gray-50"
        sx={{
          borderRadius: 2,
          borderWidth: 1,
          boxShadow: 'none',
          backgroundColor: 'white',
          cursor: 'pointer',
          '&.Mui-expanded': {
            margin: 0,
          },
          '&.MuiPaper-root': {
            paddingBottom: '56px',
          },
          '&:hover': {
            backgroundColor: 'grey.50',
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{
            '& .MuiAccordionSummary-expandIconWrapper': {
              alignSelf: 'flex-start',
              mt: 1,
            },
            '& .MuiAccordionSummary-content': {
              margin: '16px 0',
            },

            '&.Mui-expanded .MuiAccordionSummary-content': {
              margin: '16px 0',
            },
            '&:hover': {
              backgroundColor: 'grey.50',
            },
          }}
        >
          <div className="flex flex-col">
            <div id="subject-card-header" className="flex flex-col gap-[10px]">
              <div id="row-1" className="flex flex-wrap gap-6 items-center">
                <div className="font-bold text-lg">
                  {subjectDetail.subject_id}
                </div>
                <div
                  className="font-bold text-lg hover:underline"
                  onClick={handleMoreDetail}
                >
                  {subjectDetail.subject_english_name}
                </div>
                <Chip
                  label="วิชาเฉพาะ-แกน-วิศวกรรม"
                  size="small"
                  variant="outlined"
                />
              </div>
              <div id="row-2" className="flex flex-row gap-3">
                <div>{subjectDetail.credit} หน่วยกิต</div>
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
                {daySection.map((section, index) => {
                  if (section === '') return null;
                  return (
                    <CustomSectionChip key={index} day={index} sec={section} />
                  );
                })}
              </div>
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {subjectDetail.detail ? stripHtmlTags(subjectDetail.detail) : ''}
          </Typography>
          <CustomTable teachTable={subjectDetail?.teach_table} />
        </AccordionDetails>
      </Accordion>
      <div
        id="button-area"
        className="absolute flex items-end justify-between px-4 w-full bottom-4 hover:cursor-pointer"
        onClick={handleExpanded}
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
