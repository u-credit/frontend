import React from 'react';
import TinySubjectCardWithIsShowButton from '../savedsubjectcard/TinySubjectCardWithIsShowButton';
import { SubjectDto } from '@/Interfaces';
import { RootState } from '@/features/store';
import { useSelector } from 'react-redux';
import { BookmarkStateItem } from '@/features/bookmark/bookmarkSlice';

interface SavedItemsProps {
  sumCredit: number;
  categoryCredit: { [key: string]: number };
}

const SavedItems: React.FC<SavedItemsProps> = () => {
  const bookmarks = useSelector((state: RootState) => state.bookmark.items);

  return (
    <div className="flex flex-col gap-y-4">
      {bookmarks.length > 0 ? (
        <div className="flex flex-col gap-y-5">
          {bookmarks
            .filter((item: BookmarkStateItem) => item.detail !== undefined)
            .map((subject) => (
              <TinySubjectCardWithIsShowButton
                key={subject.subjectId}
                subjectDetail={subject.detail as SubjectDto}
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

export default SavedItems;
