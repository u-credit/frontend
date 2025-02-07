import SubjectCard from './SubjectCard';
import {
  CategoryGroup,
  SubjectTranscriptDto,
} from '@/Interfaces/transcript.interface';
import { Dispatch, SetStateAction, use, useEffect } from 'react';

interface SubjectContainerProps {
  allUnknowSubject?: SubjectTranscriptDto[];
}

export default function SubjectContainer({
  allUnknowSubject,
}: SubjectContainerProps) {
  return (
    <div className="flex flex-col gap-4">
      {allUnknowSubject?.map((subject) => (
        <SubjectCard
          key={subject.subject_id}
          subject={subject}
        />
      ))}
    </div>
  );
}
