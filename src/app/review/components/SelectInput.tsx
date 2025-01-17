import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface SelectInputProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label: string;
}

const SelectInput: React.FC<SelectInputProps> = ({ value, onChange, options, label }) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id={`${label}-label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-label`}
        id={`${label}-select`}
        value={value || ''}
        onChange={handleChange}
        label={label}
        IconComponent={ArrowDropDownIcon}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e0e0e0',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#bdbdbd',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          },
          borderRadius: '8px',
          '& .MuiSelect-select': {
            padding: '14px',
          },
        }}
      >
        <MenuItem value="" disabled>
          <em>{label}</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectInput;