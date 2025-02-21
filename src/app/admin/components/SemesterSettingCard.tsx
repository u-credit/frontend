import { Card, Typography, Box, Button } from '@mui/material';
import { SemesterSetting } from '@/Interfaces/semester-settings.interface';

interface SemesterSettingCardProps {
 setting: SemesterSetting | null;
 onChangeSemester: () => void;
}

export function SemesterSettingCard({ setting, onChangeSemester }: SemesterSettingCardProps) {
 return (
   <Card 
     sx={{ 
       borderRadius: 2,
       p: 4,
       display: 'flex',
       flexDirection: 'column',
       alignItems: 'center',
       gap: 4,
       border: '1px solid',
       borderColor: 'divider', 
       boxShadow: '0 4px 4px rgba(0,0,0,0.1)'
     }}
   >
     <Typography 
       variant="h4" 
       component="h1" 
       sx={{ 
         fontFamily: 'Mitr',
         pb: 2,
         borderBottom: '1px solid',
         borderColor: 'divider',
         width: '100%',
         textAlign: 'center'
       }}
     >
       ตั้งค่าภาคการศึกษา
     </Typography>

     {setting ? (
       <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
         <Box sx={{ textAlign: 'center' }}>
           <Typography variant="h5"  sx={{ fontFamily: 'Bai Jamjuree', fontWeight: 'bold', mb: 1 }}>
             ปีการศึกษา {setting.year}  ภาคการศึกษาที่ {setting.semester}
           </Typography>
           <Typography variant="body2" color="primary" sx={{ fontFamily: 'Bai Jamjuree' }}>
             อัพเดทล่าสุด: {new Date(setting.created_at).toLocaleString('th-TH')}
           </Typography>
         </Box>

         <Button
           variant="contained"
           onClick={onChangeSemester}
           sx={{
             borderRadius: 2,
             px: 4,
             py: 1,
             fontFamily: 'Mitr',
             boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
           }}
         >
           เปลี่ยนภาคการศึกษา
         </Button>
       </Box>
     ) : (
       <Box sx={{ textAlign: 'center', py: 4 }}>
         <Typography 
           variant="h6" 
           color="text.secondary" 
           sx={{ mb: 3, fontFamily: 'Mitr' }}
         >
           ไม่พบข้อมูลภาคการศึกษา
         </Typography>
         <Button
           variant="contained"
           onClick={onChangeSemester}
           sx={{
             bgcolor: '#D35400',
             '&:hover': { bgcolor: '#E67E22' },
             borderRadius: 2,
             px: 3,
             py: 1,
             fontFamily: 'Mitr',
             boxShadow: '0 2px 4px rgba(0,0,0,0.1)' // เพิ่มเงาให้ปุ่ม
           }}
         >
           เพิ่มภาคการศึกษาใหม่
         </Button>
       </Box>
     )}
   </Card>
 );
}