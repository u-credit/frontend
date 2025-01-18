import { Button } from '@mui/material';

interface ClearButtonProps {
  clearAll?: boolean;
  onClick: () => void;
}

export const ClearButon = ({ clearAll = false, onClick }: ClearButtonProps) => {
  return (
    <Button
      variant="contained"
      sx={{
        minWidth: '20px',
        height: '20px',
        padding: '4px',
        backgroundColor: 'primary.100',
        color: 'primary.300',
        '.MuiButton-startIcon': {
          margin: 0,
        },
        '&:hover': {
          backgroundColor: 'primary.100',
          color: 'primary.400',
        },
      }}
      onClick={onClick}
    >
      {clearAll ? 'ล้างทั้งหมด' : 'ล้าง'}
    </Button>
  );
};
