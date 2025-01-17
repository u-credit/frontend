'use client';
import { useSelector } from 'react-redux';
import { RootState } from '@/features/store';

export default function Home() {
  const bookmarks = useSelector((state: RootState) => state.bookmark.items);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-primary-300">
      schedule
      {bookmarks.map((item) => (
        <div key={item.subjectCode}>
          <h3>
            {item.subjectCode} {item.subjectName} {item.selectedSection}
          </h3>
        </div>
      ))}
    </main>
  );
}
