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
  const transcript = useSelector((state: RootState) => state.transcript);
  const [subjects, setSubjects] = useState<SummarySubject[]>([]);
  const [unmatchSubjects, setUnmatchSubjects] = useState<SummarySubject[]>([]);
  const [filteredSubject, setFilteredSubject] = useState<SummarySubject[]>([]);
  const [filteredUnmatchSubject, setFilteredUnmatchSubject] = useState<
    SummarySubject[]
  >([]);
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    if (subjectFlag === 'transcript') {
      setSubjects(transcript.matched);
      setUnmatchSubjects(transcript.unmatched);
    } else if (subjectFlag === 'schedule') {
      setSubjects(
        formatScheduleStateItemToSummarySubject(schedule.items || []),
      );
      setUnmatchSubjects(
        formatScheduleStateItemToSummarySubject(schedule.unmatched || []),
      );
    }
  }, [subjectFlag, schedule, transcript]);

  const prepareSubject = useCallback(() => {
    const filterBySearch = (s: SummarySubject) =>
      s.subject_ename.toLowerCase().includes(searchValue.toLowerCase()) ||
      s.subject_id.toLowerCase().includes(searchValue.toLowerCase());

    const filterBySemesterAndYear = (s: SummarySubject) =>
      s.semester === Number(semester) && s.year === Number(year);

    let newSubjects = subjects;
    let newUnmatchSubjects = unmatchSubjects;

    if (semester && year) {
      newSubjects = newSubjects.filter(filterBySemesterAndYear);
      newUnmatchSubjects = newUnmatchSubjects.filter(filterBySemesterAndYear);
    }

    if (searchValue) {
      newSubjects = newSubjects.filter(filterBySearch);
      newUnmatchSubjects = newUnmatchSubjects.filter(filterBySearch);
    }

    setFilteredSubject(newSubjects);
    setFilteredUnmatchSubject(newUnmatchSubjects);
  }, [semester, year, searchValue, subjects, unmatchSubjects]);

  useEffect(() => {
    prepareSubject();
  }, [semester, year, searchValue, prepareSubject]);

  const isUnmatchedTabActive = activeTab === tableData.length + 1;
  const isAllTabActive = activeTab === 0;

  const getFilteredSubjects = () => {
    if (isAllTabActive) return filteredSubject;
    return filteredSubject.filter((s) => s.category === activeTab);
  };

  const isEmpty = (list: SummarySubject[]) => list.length === 0;
  const getTotalCredits = () => {
    return tableData.reduce(
      (acc, cat) => {
        acc.current +=
          subjectFlag === 'transcript'
            ? cat.currentCredit
            : cat.scheduledCredit;
        acc.required += cat.requiredCredit;
        return acc;
      },
      { current: 0, required: 0 },
    );
  };

  return (
    <div className="flex flex-col gap-y-4">
      <Tabs
        value={activeTab}
        onChange={handleChange}
        aria-label="subject tabs"
        variant="scrollable"
        sx={{ fontWeight: '600' }}
      >
        <Tab label="ทั้งหมด" id="all-tab" />
        {tableData.map((cat, index) => (
          <Tab key={cat.id} label={cat.name} id={`tab-${index + 1}`} />
        ))}
        <Tab label="ไม่ตรงหลักสูตร" id="unmatched-tab" />
      </Tabs>

      {isUnmatchedTabActive ? (
        <div className="gap-y-4 flex flex-col">
          <div className="font-bai-jamjuree font-semibold">
            <span className="mr-4">รายวิชาที่ไม่ตรงหลักสูตร</span>
            <span className="text-red-500">
              {unmatchSubjects.reduce((sum, s) => sum + s.credit, 0)}
            </span>
            <span>/-</span>
          </div>
          {isEmpty(filteredUnmatchSubject) ? (
            <p className="text-center text-gray-500">
              ไม่พบรายวิชาจากตารางเรียนในหมวดนี้
            </p>
          ) : (
            filteredUnmatchSubject.map((subject, index) => (
              <SummarySubjectCard
                key={index}
                subject={subject}
                subjectFlag={subjectFlag}
              />
            ))
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-y-4">
          <div className="font-bai-jamjuree font-semibold">
            <span className="mr-4">
              {isAllTabActive ? (
                <>
                  <span className="mr-4">รายวิชาทั้งหมด</span>
                  <span className="text-red-500">
                    {getTotalCredits().current}
                  </span>
                  <span>/-</span>
                </>
              ) : (
                tableData[activeTab - 1]?.name
              )}
            </span>
            {!isAllTabActive && (
              <>
                <span className="text-red-500">
                  {subjectFlag === 'transcript'
                    ? tableData[activeTab - 1]?.currentCredit
                    : tableData[activeTab - 1]?.scheduledCredit}
                </span>
                <span>/{tableData[activeTab - 1]?.requiredCredit}</span>
              </>
            )}
          </div>
          {isEmpty(getFilteredSubjects()) ? (
            <p className="text-center text-gray-500">
              {!isAllTabActive
                ? 'ไม่พบรายวิชาจากตารางเรียนในหมวดนี้'
                : 'ไม่พบรายวิชา'}
            </p>
          ) : (
            getFilteredSubjects().map((subject, index) => (
              <SummarySubjectCard
                key={index}
                subject={subject}
                subjectFlag={subjectFlag}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SubjectContainer;
