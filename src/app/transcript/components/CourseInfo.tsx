'use client';
import { CustomSelectOutlined } from '@/app/course/components';
import { SelectOption } from '@/types';
import React, { useState } from 'react';

const options: SelectOption[] = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
];

export default function CourseInfo() {
  const [selectedValue, setSelectedValue] = useState<string>('');

  const handleSelectedValueChange = (value: string) => {
    console.log('Selected value:', value);
    setSelectedValue(value);
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="font-mitr font-medium text-xl">ข้อมูลหลักสูตรของคุณ</div>
      <div className="flex gap-x-10">
        <CustomSelectOutlined
          onSelectedValueChange={handleSelectedValueChange}
          selectOptions={options}
          selectedValue={selectedValue}
          label="คณะ"
          disabled={false}
        />
        <CustomSelectOutlined
          onSelectedValueChange={handleSelectedValueChange}
          selectOptions={options}
          selectedValue={selectedValue}
          label="ภาควิขา"
          disabled={true}
        />
        <CustomSelectOutlined
          onSelectedValueChange={handleSelectedValueChange}
          selectOptions={options}
          selectedValue={selectedValue}
          label="หลักสูตร"
          disabled={false}
        />
        <CustomSelectOutlined
          onSelectedValueChange={handleSelectedValueChange}
          selectOptions={options}
          selectedValue={selectedValue}
          label="เล่มหลักสูตร"
          disabled={false}
        />
      </div>
    </div>
  );
}
