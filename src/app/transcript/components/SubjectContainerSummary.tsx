import { useCallback, useEffect, useState } from 'react';
import {
  BookmarkStateItem,
  selectScheduledItems,
} from '@/features/bookmark/bookmarkSlice';
import { useSelector } from 'react-redux';
import { useTranscriptContext } from '@/app/contexts/TranscriptContext';
import { SubjectTranscriptDto } from '@/Interfaces';
import {
  formatBookmarkStateItemToSummarySubject,
  formatTranscriptItemToSummarySubject,
} from '@/utils';
import SummarySubjectCard, { SummarySubject } from './SummarySubjectCard';
import { RootState } from '@/features/store';
import { selectTranscripts } from '@/features/transcriptSlice';

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
        (s: SubjectTranscriptDto) =>
          s.subject_ename.toLowerCase().includes(searchValue.toLowerCase()) ||
          s.subject_id.toLowerCase().includes(searchValue.toLowerCase()),
      );
      setfilteredSubject(filtered);
      return;
    }
    const newSubject = subjects.filter(
      (s: SubjectTranscriptDto) =>
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
      {filteredSubject?.map((subject: SummarySubject, index) => (
        <SummarySubjectCard key={index} subject={subject} />
      ))}
    </div>
  );
};

export default SubjectContainer;
