'use client';
import { CloudUpload } from '@mui/icons-material';
import { Button } from '@mui/material';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function UploadTranscript() {
  const { getRootProps, getInputProps, acceptedFiles, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  return (
    <div className="flex flex-col gap-10">
      <div className="font-mitr font-medium text-xl">อัปโหลดทรานสคริปต์</div>
      <div
        {...getRootProps({
          className:
            'dropZone bg-gray-100 border border-dashed border-black h-64 rounded-2xl',
        })}
      >
        <input className="input-zone" {...getInputProps()} />
        <div className="flex gap-[10px] h-full">
          <div className="flex flex-col items-center justify-center w-1/2 gap-[10px]">
            <CloudUpload
              sx={{
                color: 'primary.400',
                minWidth: '111px',
                minHeight: '111px',
              }}
            />
            <p className="border-2 border-black">ลาก และ วางไฟล์ที่นี่</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-[10px]">
            <span className="border-l border-black h-1/4"></span>
            <p>หรือ</p>
            <span className="border-l border-black h-1/4"></span>
          </div>
          <div className="flex flex-col items-center justify-center w-1/2">
            <Button size="medium" variant="contained" onClick={open}>
              เลือกไฟล์
            </Button>
          </div>
        </div>
        <aside>
          <h4>Files</h4>
          <ul>{files}</ul>
        </aside>
      </div>
    </div>
  );
}
