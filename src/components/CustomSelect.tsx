import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { SelectOption } from '@/types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styled from '@emotion/styled';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { InputLabel } from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';

interface SelectProps {
  onSelectedValueChange: (value: string) => void;
  selectOptions: SelectOption[];
  selectedValue: string;
  label?: string;
  sx?: SxProps<Theme>;
}

export default function CustomSelect({
  onSelectedValueChange,
  selectOptions,
  selectedValue,
  label,
  sx = {},
}: SelectProps) {
  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleChange = (event: SelectChangeEvent) => {
    onSelectedValueChange(event.target.value as string);
  };

  return (
    <FormControl
      size="small"
      sx={{
        width: '100px',
        '& .MuiOutlinedInput-root': {
          borderRadius: '6px',
          '&:hover fieldset': {
            borderColor: 'primary.main',
          },
          backgroundColor: 'grey.100',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        ...sx,
      }}
    >
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        onChange={handleChange}
        onClick={handleSelectClick}
        value={selectedValue}
        IconComponent={ArrowDropDownIcon}
        variant="outlined"
        sx={{
          // fontSize: '14px',
          ...sx,
        }}
        inputProps={{ MenuProps: { disableScrollLock: true } }}
      >
        {selectOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
