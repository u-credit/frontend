'use client';
import { CloudUpload } from '@mui/icons-material';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';
import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDropzone } from 'react-dropzone';
import { uploadTranscriptFindStudentInfo } from '@/api/transcriptApi';
import { StudentInfo } from '@/Interfaces/studentInfo.interface';
interface UploadTranscriptProps {
  extractStudentInfo: (data: StudentInfo) => void;
  uploadTranscriptSuccess: (success: boolean) => void;
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
}

export default function UploadTranscript({
  extractStudentInfo,
  uploadTranscriptSuccess,
  file,
  setFile,
}: UploadTranscriptProps) {
  // const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);

        setUploadStatus('Uploading...');
        const result = await uploadTranscriptFindStudentInfo(acceptedFiles[0]);

        if (result.success) {
          setUploadStatus('File uploaded successfully!');
          uploadTranscriptSuccess(true);
          // console.log(result.data);
          extractStudentInfo({
            faculty_id: result.data.faculty_id,
            dept_id: result.data.dept_id,
            curr2_id: result.data.curr2_id,
            curri_id: result.data.curri_id,
            curr_year: result.data.curr_year,
          });
        } else {
          setUploadStatus(`Upload failed: ${result.error}`);
          console.error(result.error);
        }
      }
    },
    [extractStudentInfo],
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  const removeFile = () => {
    setFile(null);
    uploadTranscriptSuccess(false);
  };

  const handleClick = () => {
    if (window.innerWidth < 768) {
      open();
    }
  };

  return (
    <div className="flex flex-col md:gap-10 gap-5">
      <div className="font-mitr font-medium text-lg md:text-xl">
        อัปโหลดทรานสคริปต์
      </div>
      {!file ? (
        <>
          <div
            {...getRootProps({
              className:
                'dropZone bg-gray-100 border border-dashed border-black md:h-64 h-32 rounded-2xl',
              onClick: handleClick,
            })}
          >
            <input className="input-zone" {...getInputProps()} />

            <div className="flex flex-col items-center justify-center gap-2 md:hidden w-full h-full">
              <div>
                <CloudUpload
                  sx={{
                    color: 'primary.400',
                    minWidth: '48px',
                    minHeight: '48px',
                  }}
                />
              </div>
              <div className="text-sm">แตะเพื่อเลือกไฟล์</div>
            </div>

            <div className="hidden md:flex gap-[10px] h-full">
              <div className="flex flex-col items-center justify-center w-1/2 gap-[10px]">
                <CloudUpload
                  sx={{
                    color: 'primary.400',
                    minWidth: '98px',
                    minHeight: '98px',
                  }}
                />
                <p>ลาก และ วางไฟล์ที่นี่</p>
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
          </div>
        </>
      ) : (
        <div className="bg-gray-100 h-full rounded-2xl flex md:flex-row flex-col-reverse md:items-center justify-between md:p-9 pt-2 pb-5 px-5">
          <div className="flex items-center">
            <DescriptionIcon className="text-primary-400 min-w-12 min-h-12 md:min-w-16 md:min-h-16" />
            <div>
              <p className="font-semibold text-md md:text-lg">{file.name}</p>
              <p className="text-sm md:text-lg">
                {file.size < 1024 * 1024
                  ? `${(file.size / 1000).toFixed(1)} KB`
                  : `${(file.size / 1000000).toFixed(1)} MB`}{' '}
                &#x2022; Upload Successful!
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <CloseIcon onClick={removeFile} className="cursor-pointer" />
          </div>
        </div>
      )}
    </div>
  );
}
