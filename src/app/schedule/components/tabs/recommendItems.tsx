import React, { useEffect, useState } from 'react';
import TinySubjectCardWithIsShowButton from '../savedsubjectcard/TinySubjectCardWithIsShowButton';
import { SubjectDto, TeachTableRequest } from '@/Interfaces';
import { RootState } from '@/features/store';
import { useSelector } from 'react-redux';
import { fetchRecommendBookmark } from '@/api/bookmarkApi';
import { fetchRecommendSubject } from '@/api/subjectApi';

interface RecommendItemsProps {}

const RecommendItems = () => {
  const [recommendSubjects, setRecommendSubjects] = useState<SubjectDto[]>([]);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const semester = useSelector(
    (state: RootState) => state.selectorValue.semester,
  );
  const year = useSelector((state: RootState) => state.selectorValue.year);
  const curriGroup = useSelector(
    (state: RootState) => state.faculty.userCurriGroup,
  );
  const bookmarks = useSelector((state: RootState) => state.bookmark.items);
  useEffect(() => {
    async function fetchData() {
      if (isAuthenticated) {
        const data = (
          await fetchRecommendBookmark({
            year: Number(year),
            semester: Number(semester),
            faculty: curriGroup.faculty.value,
            curriculum: curriGroup.curriculum.value,
            curriculumYear: curriGroup.curriculumYear.value,
          })
        ).data;
        setRecommendSubjects(data);
      } else {
        const teachTable = bookmarks.map<TeachTableRequest>((item) => {
          return {
            subjectId: item.subjectId,
            section: item.section || '',
          };
        });

        const data = (
          await fetchRecommendSubject({
            teachTable: teachTable,
            year: Number(year),
            semester: Number(semester),
            faculty: curriGroup.faculty.value,
            curriculum: curriGroup.curriculum.value,
            curriculumYear: curriGroup.curriculumYear.value,
          })
        ).data;
        setRecommendSubjects(data);
      }
    }
    fetchData();
  }, [
    bookmarks,
    curriGroup.curriculum.value,
    curriGroup.curriculumYear.value,
    curriGroup.faculty.value,
    isAuthenticated,
    semester,
    year,
  ]);

  return (
    <div className="flex flex-col gap-y-4">
      {recommendSubjects?.length > 0 ? (
        <div className="flex flex-col gap-y-5">
          {recommendSubjects.map((subject) => (
            <TinySubjectCardWithIsShowButton
              key={subject.subject_id}
              subjectDetail={subject}
              section={''}
              showCheckbox={false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          ไม่พบรายวิชาที่บันทึกไว้
        </div>
      )}
    </div>
  );
};

export default RecommendItems;
