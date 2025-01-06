import { SubjectDto } from '../../../Interfaces';
import SubjectCard from './SubjectCard';

interface SubjectListProps {
  subjectDetail?: SubjectDto[];
}

export default function SubjectContainer({ subjectDetail }: SubjectListProps) {
  return (
    <div className="flex flex-col p-4 gap-4 bg-b">
      {subjectDetail?.map((subject) => (
        <SubjectCard key={subject.subject_id} subjectDetail={subject} />
      ))}
    </div>
  );
}
