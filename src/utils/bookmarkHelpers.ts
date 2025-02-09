import { BookmarkStateItem } from '@/features/bookmark/bookmarkSlice';
import { BookmarkDto, BookmarkItem } from '@/Interfaces';

export const getAllBookmarks = (): BookmarkItem[] => {
  const data = localStorage.getItem('bookmark');
  if (!data) return [];

  try {
    const parsedData = JSON.parse(data);
    return Object.values(parsedData).flat() as BookmarkItem[];
  } catch (error) {
    console.error('Error parsing bookmarks from localStorage', error);
    return [];
  }
};

export const formatBookmarksDtoToItem = (
  data: BookmarkDto[],
): BookmarkItem[] => {
  return data.map((item: any) => ({
    subjectId: item.subject_id,
    semester: Number(item.semester),
    year: Number(item.year),
    section: item.section,
    isShow: item.is_show,
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
    if (detail?.category && detail?.category[0]?.subgroup_name) {
      const key = detail.category
        .map((cur) => cur.group_name + cur.subgroup_name)
        .join(' หรือ ');
      catCredit[key] = (catCredit[key] || 0) + (detail.credit || 0);
    }
    totalCredits += detail.credit || 0;
  });

  return { categoryCredit: catCredit, total: totalCredits };
};
