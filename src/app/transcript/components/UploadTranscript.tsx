'use client';
import { CloudUpload } from '@mui/icons-material';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadTranscriptFindStudentInfo } from '@/api/uploadTranscriptApi';
import { StudentInfo } from '@/Interfaces/studentInfo.interface';
interface UploadTranscriptProps {
  extractStudentInfo: (data: StudentInfo) => void;
  uploadTranscriptSuccess: (success: boolean) => void;
}

export default function UploadTranscript({
  extractStudentInfo,
  uploadTranscriptSuccess,
}: UploadTranscriptProps) {
  const [file, setFile] = useState<File | null>(null);
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
          console.log(result.data);
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

  return (
    <div className="flex flex-col gap-10">
      <div className="font-mitr font-medium text-xl">อัปโหลดทรานสคริปต์</div>
      {!file ? (
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
      ) : (
        <div className="bg-gray-100 h-36 rounded-2xl flex items-center justify-between p-9">
          <div className="flex items-center">
            <DescriptionIcon
              sx={{
                color: 'primary.400',
                minWidth: '67px',
                minHeight: '67px',
              }}
            />
            <div>
              <p className="font-semibold">{file.name}</p>
              <p>
                {file.size < 1024 * 1024
                  ? `${(file.size / 1000).toFixed(1)} KB`
                  : `${(file.size / 1000000).toFixed(1)} MB`}{' '}
                &#x2022; Upload Successful!
              </p>
            </div>
          </div>
          <div>
            <CloseIcon onClick={removeFile} className="cursor-pointer" />
          </div>
        </div>
      )}
    </div>
  );
}
