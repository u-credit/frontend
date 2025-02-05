import React from 'react';
import TinySubjectCardWithIsShowButton from '../savedsubjectcard/TinySubjectCardWithIsShowButton';
import { SubjectDto } from '@/Interfaces';

interface SavedItemsProps {
  listSubjects: SubjectDto[];
  sumCredit: number;
  categoryCredit: { [key: string]: number };
}

const SavedItems: React.FC<SavedItemsProps> = ({ listSubjects }) => {
  return (
    <div className="flex flex-col gap-y-4">
      {listSubjects.length > 0 ? (
        <div className="flex flex-col gap-y-5">
          {listSubjects.map((subject) => (
            <TinySubjectCardWithIsShowButton key={subject.subject_id} subjectDetail={subject} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">ไม่พบรายวิชาที่บันทึกไว้</div>
      )}
    </div>
  );
};

export default SavedItems;
