import { Key, useCallback, useEffect, useState } from 'react';
import SummarySubjectCard from './SummarySubjectCard';

interface SubjectContainerProps {
  subjects: any;
  semester: string;
  year: string;
  searchValue: string;
}

const SubjectContainer = ({
  subjects,
  semester,
  year,
  searchValue,
}: SubjectContainerProps) => {
  const [filteredSubject, setfilteredSubject] = useState<typeof subjects>([]);
  const prepareSubject = useCallback(() => {
    if ((!semester || !year) && !searchValue) {
      setfilteredSubject(subjects);
      return;
    } else if (!semester || !year) {
      const filtered = subjects.filter(
        (s: any) =>
          s.subject_ename.toLowerCase().includes(searchValue.toLowerCase()) ||
          s.subject_id.toLowerCase().includes(searchValue.toLowerCase()),
      );
      setfilteredSubject(filtered);
      return;
    }
    const newSubject = subjects.filter(
      (s: {
        semester: string;
        year: string;
        subject_ename: string;
        subject_id: string;
      }) =>
        s.semester === semester &&
        s.year === year &&
        (s.subject_ename.toLowerCase().includes(searchValue.toLowerCase()) ||
          s.subject_id.toLowerCase().includes(searchValue.toLowerCase())),
    );
    setfilteredSubject(newSubject);
  }, [semester, year, searchValue, subjects]);

  useEffect(() => {
    prepareSubject();
  }, [semester, year, searchValue, prepareSubject]);

  return (
    <div className="flex flex-col gap-y-4">
      {filteredSubject.map((subject: typeof subjects) => (
        <SummarySubjectCard key={subject.subject_id} subjectDetail={subject} />
      ))}
    </div>
  );
};

export default SubjectContainer;
