'use client';
import { InputAdornment, SxProps, TextField, Theme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  value: string;
  onSearchValueChange: (value: string) => void;
  onSearchAction: () => void;
  sx?: SxProps<Theme>;
}

export default function CustomSearchBar({
  value,
  onSearchValueChange,
  onSearchAction,
  sx,
}: SearchBarProps) {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchValueChange(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearchAction();
    }
  };

  return (
    <TextField
      id="outlined-basic"
      label="ค้นหาด้วยรหัสวิชา หรือชื่อวิชา"
      variant="outlined"
      size="small"
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon color="primary" />
          </InputAdornment>
        ),
      }}
      value={value}
      sx={{
        width: '100%',
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          '&:hover fieldset': {
            borderColor: 'primary.main',
          },
        },
        ...sx,
      }}
    />
  );
}
