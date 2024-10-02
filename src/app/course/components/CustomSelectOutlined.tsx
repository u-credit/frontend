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
  disabled?: boolean;
}

export default function CustomSelectOutlined({
  onSelectedValueChange,
  selectOptions,
  selectedValue,
  label,
  sx = {},
  disabled = false,
}: SelectProps) {
  const handleChange = (event: SelectChangeEvent) => {
    onSelectedValueChange(event.target.value as string);
  };

  return (
    <FormControl
      size="small"
      sx={{
        width: '100%',
        borderColor: 'grey.300',
        borderWidth: '1px',
        '& .MuiInputBase-root': {
          borderRadius: '8px',
        },
        '& .MuiSelect-select': {
          backgroundColor: 'white',
          fontWeight: 'bold',
          borderRadius: '8px',
        },
        '& .MuiSelect-icon': {
          color: '#222222',
        },
        // '& .MuiOutlinedInput-root': {
        //   borderRadius: '6px',
        //   '&:hover fieldset': {
        //     borderColor: 'primary.main',
        //   },
        //   backgroundColor: 'grey.100',
        // },
        // '& .MuiOutlinedInput-notchedOutline': {
        //   border: 'none',
        // },
        '& .MuiInputBase-input.Mui-disabled': {
          backgroundColor: 'grey.200',
          color: 'grey.600',
        },
        '& .MuiSelect-icon.Mui-disabled': {
          color: 'grey.600',
        },
        ...sx,
      }}
      disabled={disabled}
    >
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        onChange={handleChange}
        value={selectedValue}
        label={label}
        IconComponent={ArrowDropDownIcon}
        variant="outlined"
        // input={<OutlinedInput label={'ttttttttt'} />}
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
