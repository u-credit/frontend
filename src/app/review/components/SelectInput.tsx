import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { InputLabel } from '@mui/material';

interface SelectInputProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label?: string;
  sx?: Record<string, any>;
}

const SelectInput: React.FC<SelectInputProps> = ({
  value,
  onChange,
  options,
  label,
  sx = {},
}) => {
  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as string);
  };

  return (
    <FormControl
      id="select-input-form"
      size="small"
      sx={{
        width: '270px',
        '& .MuiOutlinedInput-root': {
          height: '40px',
          borderRadius: '8px',
          '&:hover fieldset': {
            borderColor: 'primary.main',
          },
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderWidth: '1px',
          borderColor: 'grey.300',
        },
        ...sx,
      }}
    >
      {label && (
        <InputLabel
          id="select-input-label"
          sx={{
            backgroundColor: 'white',
            padding: '0 4px',
          }}
        >
          {label}
        </InputLabel>
      )}
      <Select
        labelId="select-input-label"
        id="select-input"
        value={value}
        onChange={handleChange}
        onClick={handleSelectClick}
        IconComponent={ArrowDropDownIcon}
        variant="outlined"
        inputProps={{ MenuProps: { disableScrollLock: true } }}
      >
        {options.map((option) => (
          <MenuItem
            id={`select-option-${option.toLowerCase().replace(/\s+/g, '-')}`}
            key={option}
            value={option}
          >
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectInput;
