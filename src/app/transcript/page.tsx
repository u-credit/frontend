'use client';
import { useEffect, useState } from 'react';
import { CurriGroup } from '@/Interfaces';
import UploadTranscriptPage from './components/UploadTranscriptPage';
import RecheckPage from './components/RecheckPage';
import { initSelectOption, SelectOption } from '@/types';
import { CategoryGroup } from '@/Interfaces/transcript.interface';
import { fetchListCategory } from '@/api/transcriptApi';

export default function Home() {
  const [currentSection, setCurrentSection] = useState<string>('upload');
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);

  const [file, setFile] = useState<File | null>(null);

  const [selectedCurriGroup, setSelectedCurriGroup] = useState<CurriGroup>({
    faculty: initSelectOption(),
    department: initSelectOption(),
    curriculum: initSelectOption(),
    curriculumYear: initSelectOption(),
  });

  const [selectedCategory, setSelectCategory] = useState<CategoryGroup>({
    category: initSelectOption(),
    group: initSelectOption(),
    subgroup: initSelectOption(),
    childgroup: initSelectOption(),
  });

  const handleNext = (section: string) => {
    setCurrentSection(section);
  };

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const params = {
          faculty: selectedCurriGroup.faculty.value,
          department: selectedCurriGroup.department.value,
          curriculum: selectedCurriGroup.curriculum.value,
          curriculumYear: selectedCurriGroup.curriculumYear.value,
        };
        const resp = await fetchListCategory(params);
        const data = resp?.data || [];

        const categoryOptions: SelectOption[] = data.map((category: any) => ({
          label: category.c_cat_name,
          value: category.category,
          children: category.group?.map((group: any) => ({
            label: group.c_group_name,
            value: group.group,
            children: group?.subgroup?.map((subgroup: any) => ({
              label: subgroup.c_subgroup_name,
              value: subgroup.subgroup,
              children: subgroup.children?.map((childGroup: any) => ({
                label: childGroup.c_subgroup_name,
                value: childGroup.subgroup,
              })),
            })),
          })),
        }));
        setCategoryOptions(categoryOptions);
      } catch (error) {
        console.log('error', error);
      }
    };

    loadCategory();
    setSelectCategory({
      category: initSelectOption(),
      group: initSelectOption(),
      subgroup: initSelectOption(),
      childgroup: initSelectOption(),
    });
  }, [selectedCurriGroup]);

  return (
    <main className="flex flex-row bg-gray-100 min-h-[calc(100vh-48px)] w-full">
      <div className="w-full border-solid px-20 my-[10px]">
        <div className="bg-white h-full rounded-3xl p-10">
          {currentSection === 'upload' && (
            <UploadTranscriptPage
              selectedCurriGroup={selectedCurriGroup}
              setSelectedCurriGroup={setSelectedCurriGroup}
              file={file}
              setFile={setFile}
              onNext={() => handleNext('recheck')}
            />
          )}
          {currentSection === 'recheck' && (
            <RecheckPage
              selectedCurriGroup={selectedCurriGroup}
              setSelectedCurriGroup={setSelectedCurriGroup}
              selectedCategory={selectedCategory}
              setSelectCategory={setSelectCategory}
              categoryOptions={categoryOptions}
              file={file!}
              onNext={() => handleNext('summary')}
            />
          )}
        </div>
      </div>
    </main>
  );
}
