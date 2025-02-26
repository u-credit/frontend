import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatScheduleStateItemToSummarySubject } from '@/utils';
import SummarySubjectCard, { SummarySubject } from './SummarySubjectCard';
import { useSummaryContext } from '@/app/contexts/SummaryContext';
import { RootState } from '@/features/store';

interface SubjectContainerProps {
  subjectFlag: string;
  semester: string;
  year: string;
  searchValue: string;
  activeCategoryTab: number;
}

const SubjectContainer = ({
  subjectFlag,
  semester,
  year,
  searchValue,
  activeCategoryTab,
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

  const isUnmatchedTabActive = activeCategoryTab === tableData.length + 1;
  const isAllTabActive = activeCategoryTab === 0;

  const getFilteredSubjects = () => {
    if (isAllTabActive) return filteredSubject;
    return filteredSubject.filter((s) => s.category === activeCategoryTab);
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
    <div className="flex flex-row gap-4 w-full grow">
      {isUnmatchedTabActive ? (
        <div className="gap-y-4 flex flex-col grow">
          <div className="font-bai-jamjuree font-semibold ">
            <span className="mr-4">รายวิชาที่ไม่ตรงหลักสูตร</span>
            <span className="text-red-500 mr-1">
              {unmatchSubjects.reduce((sum, s) => sum + s.credit, 0)}
            </span>
            <span>หน่วยกิต</span>
          </div>
          {isEmpty(filteredUnmatchSubject) ? (
            <p className="flex h-full justify-center items-center text-center text-gray-500">
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
        <div className="flex flex-col gap-y-4 w-full">
          <div className="font-bai-jamjuree font-semibold">
            <span className="mr-4">
              {isAllTabActive ? (
                <>
                  <span className="mr-4">รายวิชาทั้งหมด</span>
                  <span className="text-red-500">
                    {getTotalCredits().current}
                  </span>
                  <span>/{getTotalCredits().required}</span>
                </>
              ) : (
                tableData[activeCategoryTab - 1]?.name
              )}
            </span>
            {!isAllTabActive && (
              <>
                <span className="text-red-500">
                  {subjectFlag === 'transcript'
                    ? tableData[activeCategoryTab - 1]?.currentCredit
                    : tableData[activeCategoryTab - 1]?.scheduledCredit}
                </span>
                <span>/{tableData[activeCategoryTab - 1]?.requiredCredit}</span>
              </>
            )}
          </div>
          {isEmpty(getFilteredSubjects()) ? (
            <div className="flex text-center text-gray-500 h-full justify-center item">
              {!isAllTabActive
                ? 'ไม่พบรายวิชาจากตารางเรียนในหมวดนี้'
                : 'ไม่พบรายวิชา'}
            </div>
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
