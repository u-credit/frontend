import { useCallback, useEffect, useState } from 'react';
import { selectScheduledItems } from '@/features/bookmark/bookmarkSlice';
import { useSelector } from 'react-redux';
import {
  formatBookmarkStateItemToSummarySubject,
  formatTranscriptItemToSummarySubject,
} from '@/utils';
import SummarySubjectCard, { SummarySubject } from './SummarySubjectCard';
import { selectTranscripts } from '@/features/transcriptSlice';
import { useSummaryContext } from '@/app/contexts/SummaryContext';

interface SubjectContainerProps {
  subjectFlag: string;
  semester: string;
  year: string;
  searchValue: string;
}

const SubjectContainer = ({
  subjectFlag,
  semester,
  year,
  searchValue,
}: SubjectContainerProps) => {
  const { tableData } = useSummaryContext();
  const schedule = useSelector(selectScheduledItems);
  const [subjects, setSubjects] = useState<SummarySubject[]>([]);
  const transcriptSubject = useSelector(selectTranscripts);

  useEffect(() => {
    if (subjectFlag === 'transcript') {
      const formated = formatTranscriptItemToSummarySubject(transcriptSubject);
      setSubjects(formated);
    } else if (subjectFlag === 'schedule') {
      const formated = formatBookmarkStateItemToSummarySubject(schedule);
      setSubjects(formated);
    }
  }, [subjectFlag, schedule, transcriptSubject]);

  const [filteredSubject, setfilteredSubject] = useState<SummarySubject[]>([]);

  const prepareSubject = useCallback(() => {
    if ((!semester || !year) && !searchValue) {
      setfilteredSubject(subjects);
      return;
    } else if (!semester || !year) {
      const filtered = subjects.filter(
        (s: SummarySubject) =>
          s.subject_ename.toLowerCase().includes(searchValue.toLowerCase()) ||
          s.subject_id.toLowerCase().includes(searchValue.toLowerCase()),
      );
      setfilteredSubject(filtered);
      return;
    } else if (!searchValue) {
      const newSubject = subjects.filter((s: SummarySubject) => {
        return s.semester === Number(semester) && s.year === Number(year);
      });
      setfilteredSubject(newSubject);
    } else if (!searchValue) {
      const newSubject = subjects.filter(
        (s: SummarySubject) =>
          s.semester === Number(semester) &&
          s.year === Number(year) &&
          (s.subject_ename.toLowerCase().includes(searchValue.toLowerCase()) ||
            s.subject_id.toLowerCase().includes(searchValue.toLowerCase())),
      );
      setfilteredSubject(newSubject);
    }
  }, [semester, year, searchValue, subjects]);

  useEffect(() => {
    prepareSubject();
  }, [semester, year, searchValue, prepareSubject]);
  return (
    <div className="flex flex-col gap-y-4">
      {tableData.map((cat, index) => (
        <div key={index} className="flex flex-col gap-y-4">
          <div className="font-bai-jamjuree font-semibold">
            <span className="mr-4">{cat.name}</span>
            <span className="text-red-500">{cat.currentCredit}</span>
            <span>/{cat.requiredCredit}</span>
          </div>
          {filteredSubject
            ?.filter((s) => s.category === cat.id)
            .map((subject: SummarySubject, index) => (
              <SummarySubjectCard
                key={index}
                subject={subject}
                subjectFlag={subjectFlag}
              />
            ))}
        </div>
      ))}
    </div>
  );
};

export default SubjectContainer;
