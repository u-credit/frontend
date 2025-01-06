import { BookmarkItem } from '@/Interfaces';
import Cookies from 'js-cookie';

export function getIsBookmarkCookie(
  subjectId: string,
): BookmarkItem | undefined {
  const savedBookmarks = Cookies.get('bookmark');
  let isBookmarked;
  if (savedBookmarks) {
    const bookmarks = JSON.parse(savedBookmarks);
    isBookmarked = bookmarks.items.find(
      (bookmark: { subjectId: string }) => bookmark.subjectId === subjectId,
    );
  }
  return isBookmarked;
}
