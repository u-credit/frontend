import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatScheduleStateItemToSummarySubject } from '@/utils';
import SummarySubjectCard, { SummarySubject } from './SummarySubjectCard';
import { useSummaryContext } from '@/app/contexts/SummaryContext';
import { RootState } from '@/features/store';
import { Tabs, Tab } from '@mui/material';

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
  const schedule = useSelector((state: RootState) => state.schedule);
  const [subjects, setSubjects] = useState<SummarySubject[]>([]);
  const [unmatchSubjects, setUnmatchSubjects] = useState<SummarySubject[]>([]);
  const transcript = useSelector((state: RootState) => state.transcript);
  const [activeTab, setActiveTab] = useState(0);
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  useEffect(() => {
    if (subjectFlag === 'transcript') {
      // const formated = formatTranscriptItemToSummarySubject(transcript.matched);
      // const formatedUnmatch = formatTranscriptItemToSummarySubject(
      //   transcript.unmatched,
      // );
      setSubjects(transcript.matched);
      setUnmatchSubjects(transcript.unmatched);
    } else if (subjectFlag === 'schedule') {
      const formated = formatScheduleStateItemToSummarySubject(
        schedule.items || [],
      );
      const formatedUnmatch = formatScheduleStateItemToSummarySubject(
        schedule.unmatched || [],
      );
      setSubjects(formated);
      setUnmatchSubjects(formatedUnmatch);
    }
  }, [subjectFlag, schedule, transcript]);

  const [filteredSubject, setfilteredSubject] = useState<SummarySubject[]>([]);
  const [filteredUnmatchSubject, setfilteredUnmatchSubject] = useState<
    SummarySubject[]
  >([]);

  const prepareSubject = useCallback(() => {
    if ((!semester || !year) && !searchValue) {
      setfilteredSubject(subjects);
      setfilteredUnmatchSubject(unmatchSubjects);
      return;
    } else if (!semester || !year) {
      const filtered = subjects.filter(
        (s: SummarySubject) =>
          s.subject_ename.toLowerCase().includes(searchValue.toLowerCase()) ||
          s.subject_id.toLowerCase().includes(searchValue.toLowerCase()),
      );
      const filteredUnmatch = unmatchSubjects.filter(
        (s: SummarySubject) =>
          s.subject_ename.toLowerCase().includes(searchValue.toLowerCase()) ||
          s.subject_id.toLowerCase().includes(searchValue.toLowerCase()),
      );
      setfilteredSubject(filtered);
      setfilteredUnmatchSubject(filteredUnmatch);
      return;
    } else if (!searchValue) {
      const newSubject = subjects.filter((s: SummarySubject) => {
        return s.semester === Number(semester) && s.year === Number(year);
      });
      const newUnmatchSubject = unmatchSubjects.filter((s: SummarySubject) => {
        return s.semester === Number(semester) && s.year === Number(year);
      });
      setfilteredSubject(newSubject);
      setfilteredUnmatchSubject(newUnmatchSubject);
    } else if (!searchValue) {
      const newSubject = subjects.filter(
        (s: SummarySubject) =>
          s.semester === Number(semester) &&
          s.year === Number(year) &&
          (s.subject_ename.toLowerCase().includes(searchValue.toLowerCase()) ||
            s.subject_id.toLowerCase().includes(searchValue.toLowerCase())),
      );
      const newUnmatchSubject = unmatchSubjects.filter(
        (s: SummarySubject) =>
          s.semester === Number(semester) &&
          s.year === Number(year) &&
          (s.subject_ename.toLowerCase().includes(searchValue.toLowerCase()) ||
            s.subject_id.toLowerCase().includes(searchValue.toLowerCase())),
      );
      setfilteredSubject(newSubject);
      setfilteredUnmatchSubject(newUnmatchSubject);
    }
  }, [semester, year, searchValue, subjects, unmatchSubjects]);

  useEffect(() => {
    prepareSubject();
  }, [semester, year, searchValue, prepareSubject]);

  const isUnmatchedTabActive = activeTab === tableData.length;

  return (
    <div className="flex flex-col gap-y-4">
      <Tabs
        value={activeTab}
        onChange={handleChange}
        aria-label="basic tabs example"
        variant="scrollable"
        sx={{
          fontWeight: '600',
        }}
      >
        {tableData.map((cat, index) => (
          <Tab key={cat.id} label={cat.name} id={cat.name} />
        ))}
        <Tab label="ไม่ตรงหลักสูตร" id="unmatched-tab" />
      </Tabs>

      {isUnmatchedTabActive ? (
        <>
          <span className="font-bai-jamjuree font-semibold mr-4">
            รายวิชาที่ไม่ตรงหลักสูตร
          </span>
          {filteredUnmatchSubject.map((subject: SummarySubject, index) => (
            <SummarySubjectCard
              key={index}
              subject={subject}
              subjectFlag={subjectFlag}
            />
          ))}
        </>
      ) : (
        <div className="flex flex-col gap-y-4">
          <div className="font-bai-jamjuree font-semibold">
            <span className="mr-4">{tableData[activeTab]?.name}</span>
            <span className="text-red-500">
              {subjectFlag == 'transcript'
                ? tableData[activeTab]?.currentCredit
                : tableData[activeTab]?.scheduledCredit}
            </span>
            <span>/{tableData[activeTab]?.requiredCredit}</span>
          </div>
          {filteredSubject
            ?.filter((s) => s.category === activeTab + 1)
            .map((subject: SummarySubject, index) => (
              <SummarySubjectCard
                key={index}
                subject={subject}
                subjectFlag={subjectFlag}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default SubjectContainer;
