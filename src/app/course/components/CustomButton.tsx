import { Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

export default function CustomButton() {
  return (
    <Button variant="contained" startIcon={<SaveIcon />} sx={{minWidth:'115px'}}>
      วิชาที่บันทึก
    </Button>
  );
}
