import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { SelectOption } from '@/types';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { InputLabel } from '@mui/material';

interface SelectProps {
  selectedValue: SelectOption;
  label?: string;
}

export default function CustomSelectOutlinedDisable({
  selectedValue,
  label,
}: SelectProps) {
  return (
    <FormControl
      size="small"
      sx={{
        width: '100%',
        borderWidth: '1px',
        '& .MuiInputBase-root': {
          borderRadius: '8px',
        },
        '& .MuiSelect-select': {
          backgroundColor: 'white',
          borderRadius: '8px',
        },
        '& .MuiSelect-icon': {
          color: '#222222',
        },
        '& .MuiInputBase-input.Mui-disabled': {
          backgroundColor: 'grey.200',
          color: 'grey.600',
        },
        '& .MuiSelect-icon.Mui-disabled': {
          color: 'grey.600',
        },
      }}
      disabled={true}
    >
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        onChange={() => {}}
        value={selectedValue.value}
        label={label}
        IconComponent={ArrowDropDownIcon}
        variant="outlined"
        inputProps={{ MenuProps: { disableScrollLock: true } }}
      >
        <MenuItem value={selectedValue.value}>{selectedValue.label}</MenuItem>
      </Select>
    </FormControl>
  );
}
