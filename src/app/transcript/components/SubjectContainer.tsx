import SubjectCard from './SubjectCard';
import {
  SubjectTranscriptDto,
} from '@/Interfaces/transcript.interface';

interface SubjectContainerProps {
  unmatchSubjects?: SubjectTranscriptDto[];
}

export default function SubjectContainer({
  unmatchSubjects,
}: SubjectContainerProps) {
  return (
    <div className="flex flex-col gap-4">
      {unmatchSubjects?.map((subject) => (
        <SubjectCard
          key={subject.subject_id}
          subject={subject}
        />
      ))}
    </div>
  );
}
