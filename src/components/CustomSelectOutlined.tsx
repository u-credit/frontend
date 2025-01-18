import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { SelectOption } from '@/types';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { InputLabel } from '@mui/material';

interface SelectProps {
  onSelectedValueChange: (value: SelectOption) => void;
  selectOptions: SelectOption[];
  selectedValue: SelectOption;
  label?: string;
  sx?: SxProps<Theme>;
  disabled?: boolean;
  error?: boolean;
}

export default function CustomSelectOutlined({
  onSelectedValueChange,
  selectOptions,
  selectedValue,
  label,
  sx = {},
  disabled = false,
  error = false,
}: SelectProps) {
  const handleChange = (event: SelectChangeEvent) => {
    const selectValue = event.target.value;
    const selectOption = selectOptions.find(
      (option) => option.value === selectValue,
    );
    if (selectOption) {
      onSelectedValueChange(selectOption);
    }
  };

  return (
    <FormControl
      error={error}
      size="small"
      sx={{
        width: '100%',
        borderWidth: '1px',
        '& .MuiInputBase-root': {
          borderRadius: '8px',
        },
        '& .MuiSelect-select': {
          backgroundColor: 'white',
          // fontWeight: 'bold',
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
        value={String(selectedValue.value)}
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
