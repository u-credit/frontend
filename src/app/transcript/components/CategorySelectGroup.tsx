import { CustomSelectOutlined } from '@/components';
import { CategoryGroup } from '@/Interfaces/transcript.interface';
import { initSelectOption, SelectOption } from '@/types';
import React, { Dispatch, SetStateAction } from 'react';

interface CategorySelectGroupProps {
  selectedCategory: CategoryGroup;
  setSelectCategory: Dispatch<SetStateAction<CategoryGroup>>;
  categoryOptions: SelectOption[];
}

export default function CategorySelectGroup({
  selectedCategory,
  setSelectCategory,
  categoryOptions,
}: CategorySelectGroupProps) {
  const handleCategoryChange = (value: SelectOption) => {
    setSelectCategory((prev) => {
      return {
        ...prev,
        category: value,
        group: initSelectOption(),
        subgroup: initSelectOption(),
        childgroup: initSelectOption(),
      };
    });
  };

  const handleGroupChange = (value: SelectOption) => {
    setSelectCategory((prev) => {
      return {
        ...prev,
        group: value,
        subgroup: initSelectOption(),
        childgroup: initSelectOption(),
      };
    });
  };

  const handleSubGroupChange = (value: SelectOption) => {
    setSelectCategory((prev) => {
      return {
        ...prev,
        subgroup: value,
        childgroup: initSelectOption(),
      };
    });
  };

  const handleChildGroupChange = (value: SelectOption) => {
    setSelectCategory((prev) => {
      return {
        ...prev,
        childgroup: value,
      };
    });
  };

  return (
    <>
      <CustomSelectOutlined
        onSelectedValueChange={handleCategoryChange}
        selectOptions={categoryOptions}
        selectedValue={selectedCategory.category}
        label="หมวดหมู่รายวิชา"
      />
      <CustomSelectOutlined
        onSelectedValueChange={handleGroupChange}
        selectOptions={selectedCategory.category.children || []}
        selectedValue={selectedCategory.group}
        label="หมวดหมู่ย่อย"
        disabled={
          !selectedCategory.category.value ||
          selectedCategory.category?.children?.length === 0
        }
      />
      <CustomSelectOutlined
        onSelectedValueChange={handleSubGroupChange}
        selectOptions={selectedCategory.group.children || []}
        selectedValue={selectedCategory.subgroup}
        label="กลุ่มวิชา"
        disabled={
          !selectedCategory.group.value ||
          selectedCategory.group?.children?.length === 0
        }
      />
      <CustomSelectOutlined
        onSelectedValueChange={handleChildGroupChange}
        selectOptions={selectedCategory.subgroup.children || []}
        selectedValue={selectedCategory.childgroup}
        label="กลุ่มวิชาย่อย"
        disabled={
          !selectedCategory.subgroup.value ||
          selectedCategory.subgroup?.children?.length === 0 ||
          selectedCategory.subgroup?.children == undefined
        }
      />
    </>
  );
}
