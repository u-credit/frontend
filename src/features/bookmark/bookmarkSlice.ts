import { BookmarkItem } from '@/Interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface BookmarkState {
  items: BookmarkItem[];
}

const getInitialBookmarkState = (): BookmarkState => {
  const cookieBookmark = Cookies.get('bookmark');
  return cookieBookmark ? JSON.parse(cookieBookmark) : { items: [] };
};

const initialState: BookmarkState = getInitialBookmarkState();

const bookmarkSlice = createSlice({
  name: 'bookmark',
  initialState,
  reducers: {
    setBookmarks: (state, action) => {
      state.items = action.payload;
    },
    addBookmark: (state, action: PayloadAction<BookmarkItem>) => {
      const existingItem = state.items.find(
        (item) => item.subjectId === action.payload.subjectId,
      );
      if (!existingItem) {
        state.items.push(action.payload);
      }
      Cookies.set('bookmark', JSON.stringify(state), { expires: 7 });
    },
    editBookmark: (state, action: PayloadAction<BookmarkItem>) => {
      const existingItem = state.items.find(
        (item) => item.subjectId === action.payload.subjectId,
      );
      if (existingItem) {
        existingItem.selectedSection = action.payload.selectedSection;
      }
      Cookies.set('bookmark', JSON.stringify(state), { expires: 7 });
    },
    removeBookmark: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.subjectId !== action.payload,
      );
      Cookies.set('bookmark', JSON.stringify(state), { expires: 7 });
    },
    clearBookmark: (state) => {
      state.items = [];
      Cookies.remove('bookmark');
    },
  },
});

export const {
  setBookmarks,
  addBookmark,
  editBookmark,
  removeBookmark,
  clearBookmark,
} = bookmarkSlice.actions;
export default bookmarkSlice.reducer;
