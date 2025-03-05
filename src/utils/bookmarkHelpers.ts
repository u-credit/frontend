import { BookmarkStateItem } from '@/features/bookmark/bookmarkSlice';
import { Bookmark, BookmarkItem } from '@/Interfaces';

export const getAllBackupBookmarks = (): BookmarkItem[] => {
  const data = localStorage.getItem('backupBookmark');
  if (!data) return [];

  try {
    const parsedData = JSON.parse(data);
    return Object.values(parsedData).flat() as BookmarkItem[];
  } catch (error) {
    console.error('Error parsing bookmarks from localStorage', error);
    return [];
  }
};

export const formatBookmarkToItem = (data: Bookmark[]): BookmarkItem[] => {
  return data.map((item: Bookmark) => ({
    subjectId: item.subject_id,
    semester: Number(item.semester),
    year: Number(item.year),
    section: item.section,
    isShow: item.is_show,
    detail: item.subject,
  }));
};

export const getCategoryCredit = (
  bookmarks: BookmarkStateItem[],
): { categoryCredit: { [key: string]: number }; total: number } => {
  let catCredit: { [key: string]: number } = {};
  let totalCredits = 0;
  bookmarks.forEach((bm) => {
    const detail = bm.detail;
    if (!detail) return;
    if (detail?.categories && detail?.categories[0]?.subgroup_name) {
      const key = detail.categories
        .map((cur) => cur.group_name + cur.subgroup_name)
        .join(' หรือ ');
      catCredit[key] = (catCredit[key] || 0) + (detail.credit || 0);
    }
    totalCredits += detail.credit || 0;
  });

  return { categoryCredit: catCredit, total: totalCredits };
};
