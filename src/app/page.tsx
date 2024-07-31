'use client';
import { Box, Typography, Button } from '@mui/material';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center space-y-2 p-24 bg-primary-white">
      home
      <div className="flex flex-row">
        <div className="bg-primary-100 flex flex-col p-4 m-4 space-y-4 rounded-md max-w-96">
          <Box className="bg-success-200 rounded-md p-3">
            mui font working with global.css ok ok
            <Typography sx={{ fontFamily: 'inter' }}>
              Font inter สวัสดี
            </Typography>
            <Typography sx={{ fontFamily: 'bai Jamjuree' }}>
              Font bai jamjuree สวัสดี
            </Typography>
            <Typography sx={{ fontFamily: 'mitr' }}>
              Font mitr สวัสดี
            </Typography>
            <Typography sx={{ fontFamily: 'Rubik' }}>
              Font rubik สวัสดี
            </Typography>
          </Box>
          <Typography>Font Default สวัสดี mui-theme.ts</Typography>
          <Typography>
            ตอนนี้เซ็ตเป็น bai jamjuree แก้ไขที่ mui-theme.ts
          </Typography>
        </div>
        <div className="bg-primary-100 flex flex-col p-4 m-4 space-y-2 rounded-md max-w-96">
          <div className="self-center">
            tailwind working on Box Mui (some component not fullable control or
            can see changing when loading )
          </div>
          <Box className="bg-primary-200 rounded-full p-3 hover:bg-primary-400 hover:cursor-pointer font-inter transition-colors duration-300 ease-in-out">
            Font inter Tailwind สวัสดี
          </Box>
          <Box className="bg-primary-200 rounded-full p-3 hover:bg-primary-400 hover:cursor-pointer font-bai-jamjuree transition-colors duration-300 ease-in-out">
            Font Bai Jamjuree Tailwind สวัสดี
          </Box>
          <Box className="bg-primary-200 rounded-full p-3 hover:bg-primary-400 hover:cursor-pointer font-mitr transition-colors duration-300 ease-in-out">
            Font Mitr Tailwind สวัสดี
          </Box>
          <Box className="bg-primary-200 rounded-full p-3 hover:bg-primary-400 hover:cursor-pointer font-rubik transition-colors duration-300 ease-in-out">
            Font Rubik Tailwind สวัสดี
          </Box>
        </div>
        <div className="bg-primary-100 flex flex-col p-4 m-4 space-y-4 rounded-md max-w-96">
          <div className="self-center">
            เพิ่ม global theme mui at src/utils/mui-theme.ts
          </div>
          <Button variant="outlined">
            style primary mui color ใหม่ ปุ่มนี้ไม่ได้เพิ่มไร
          </Button>
          <Button
            color="customSalmon"
            variant="contained"
            sx={{
              fontFamily: 'mitr',
            }}
          >
            custom salmon + font mitr จาก global.css
          </Button>
        </div>
      </div>
    </main>
  );
}
