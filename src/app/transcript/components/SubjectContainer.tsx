import SubjectCard from './SubjectCard';
import {
  CategoryGroup,
  SubjectTranscriptDto,
} from '@/Interfaces/transcript.interface';
import { Dispatch, SetStateAction } from 'react';
import { SelectOption } from '@/types';

interface SubjectContainerProps {
  subjectDetail?: SubjectTranscriptDto[];
  selectedCategory: CategoryGroup;
  setSelectCategory: Dispatch<SetStateAction<CategoryGroup>>;
  categoryOptions: SelectOption[];
}

export default function SubjectContainer({
  subjectDetail,
  selectedCategory,
  setSelectCategory,
  categoryOptions,
}: SubjectContainerProps) {
  return (
    <div className="flex flex-col gap-4">
      {subjectDetail?.map((subject) => (
        <SubjectCard
          key={subject.subject_id}
          selectedCategory={selectedCategory}
          setSelectCategory={setSelectCategory}
          categoryOptions={categoryOptions}
          subjectDetail={subject}
        />
      ))}
    </div>
  );
}
