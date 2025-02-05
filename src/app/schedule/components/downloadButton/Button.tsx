'use client';

import React from 'react';
import { Button } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import html2canvas from 'html2canvas';

export default function DownloadButton() {
  const handleDownloadPNG = async () => {
    const timetableElement = document.querySelector('.timetable-container') as HTMLElement;
    if (!timetableElement) return;

    try {
      const clone = timetableElement.cloneNode(true) as HTMLElement;
      clone.style.position = 'fixed'; 
      clone.style.top = '0';
      clone.style.left = '0';
      clone.style.width = '1000px'; 
      clone.style.height = 'auto';
      clone.style.zIndex = '-1';
      clone.style.visibility = 'visible';

      document.body.appendChild(clone);

      await document.fonts.ready;

      const canvas = await html2canvas(clone, {
        backgroundColor: '#ffffff', 
        useCORS: true, 
        scale: 2, 
        width: 1000, 
        height: clone.scrollHeight,
      });

      document.body.removeChild(clone);

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'timetable.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error downloading PNG:', error);
    }
  };

  return (
    <Button
      variant="contained"
      startIcon={<FileDownloadOutlinedIcon />}
      sx={{ width: '89px' }}
      data-testid="download-png-button"
      onClick={handleDownloadPNG}
    >
      PNG
    </Button>
  );
}
