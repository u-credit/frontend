import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import React from 'react';

export default function SubjectCard() {
  return (
    <div>
      <div className="flex flex-col gap-5 overflow-y-auto min-h-80 h-[30vh]">
        <div className="bg-white rounded-lg border-[1px] p-4 border-gray-300 h-28">
          <div className="flex justify-between w-full h-full">
            <div className="flex flex-col justify-between">
              <div className="flex flex-wrap gap-6 items-center">
                <div className="font-bold text-xl">01076011</div>
                <div className="font-bold text-xl">Operationg Systems</div>
              </div>
              <div>3 หน่วยกิต</div>
            </div>
            <div className="flex items-center">
              <Button size="medium" variant="contained" startIcon={<Add />}>
                เพิ่มหมวดหมู่
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border-[1px] p-4 border-gray-300 h-28">
          <div className="flex justify-between w-full h-full">
            <div className="flex flex-col justify-between">
              <div className="flex flex-wrap gap-6 items-center">
                <div className="font-bold text-xl">01076011</div>
                <div className="font-bold text-xl">Operationg Systems</div>
              </div>
              <div>3 หน่วยกิต</div>
            </div>
            <div className="flex items-center">
              <Button size="medium" variant="contained" startIcon={<Add />}>
                เพิ่มหมวดหมู่
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border-[1px] p-4 border-gray-300 h-28">
          <div className="flex justify-between w-full h-full">
            <div className="flex flex-col justify-between">
              <div className="flex flex-wrap gap-6 items-center">
                <div className="font-bold text-xl">01076011</div>
                <div className="font-bold text-xl">Operationg Systems</div>
              </div>
              <div>3 หน่วยกิต</div>
            </div>
            <div className="flex items-center">
              <Button size="medium" variant="contained" startIcon={<Add />}>
                เพิ่มหมวดหมู่
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border-[1px] p-4 border-gray-300 h-28">
          <div className="flex justify-between w-full h-full">
            <div className="flex flex-col justify-between">
              <div className="flex flex-wrap gap-6 items-center">
                <div className="font-bold text-xl">01076011</div>
                <div className="font-bold text-xl">Operationg Systems</div>
              </div>
              <div>3 หน่วยกิต</div>
            </div>
            <div className="flex items-center">
              <Button size="medium" variant="contained" startIcon={<Add />}>
                เพิ่มหมวดหมู่
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border-[1px] p-4 border-gray-300 h-28">
          <div className="flex justify-between w-full h-full">
            <div className="flex flex-col justify-between">
              <div className="flex flex-wrap gap-6 items-center">
                <div className="font-bold text-xl">01076011</div>
                <div className="font-bold text-xl">Operationg Systems</div>
              </div>
              <div>3 หน่วยกิต</div>
            </div>
            <div className="flex items-center">
              <Button size="medium" variant="contained" startIcon={<Add />}>
                เพิ่มหมวดหมู่
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
