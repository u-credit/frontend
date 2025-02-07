import { BookmarkItem } from '@/Interfaces';
import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import { RootState } from '../store';

const getBookmarks = (semester: string, year: string) => {
  const bookmarks = JSON.parse(localStorage.getItem('bookmark') || '{}');
  const b = bookmarks[`${semester}${year}`];
  return b ?? [];
};

const saveBookmarks = (
  semester: string,
  year: string,
  data: BookmarkItem[],
) => {
  const bookmarks = JSON.parse(localStorage.getItem('bookmark') || '');
  bookmarks[`${semester}${year}`] = data;
  localStorage.setItem('bookmark', JSON.stringify(bookmarks));
};

export const loadBookmarks = createAsyncThunk(
  'bookmark/loadBookmarks',
  async (_, { getState, dispatch }) => {
    const { semester, year } = (getState() as RootState).selectorValue;
    const b = getBookmarks(semester, year);
    saveBookmarks(semester, year, b);
    dispatch(setBookmarks(b));
  },
);

export const addBookmark = createAsyncThunk(
  'bookmark/addBookmark',
  async (bookmark: BookmarkItem, { getState, dispatch }) => {
    const { semester, year } = (getState() as RootState).selectorValue;
    const currentBookmarks = getBookmarks(semester, year);

    if (
      !currentBookmarks.some(
        (b: BookmarkItem) => b.subjectId === bookmark.subjectId,
      )
    ) {
      const updatedBookmarks = [...currentBookmarks, bookmark];
      saveBookmarks(semester, year, updatedBookmarks);
      dispatch(setBookmarks(updatedBookmarks));
    }
  },
);

export const editBookmark = createAsyncThunk(
  'bookmark/editBookmark',
  async (updatedBookmark: BookmarkItem, { getState, dispatch }) => {
    const { semester, year } = (getState() as RootState).selectorValue;
    const currentBookmarks = getBookmarks(semester, year);

    const updatedBookmarks = currentBookmarks.map((b: BookmarkItem) =>
      b.subjectId === updatedBookmark.subjectId ? updatedBookmark : b,
    );

    saveBookmarks(semester, year, updatedBookmarks);
    dispatch(setBookmarks(updatedBookmarks));
  },
);

export const removeBookmark = createAsyncThunk(
  'bookmark/removeBookmark',
  async (subjectId: string, { getState, dispatch }) => {
    const { semester, year } = (getState() as RootState).selectorValue;
    const currentBookmarks = getBookmarks(semester, year);

    const updatedBookmarks = currentBookmarks.filter(
      (b: BookmarkItem) => b.subjectId !== subjectId,
    );
    saveBookmarks(semester, year, updatedBookmarks);
    dispatch(setBookmarks(updatedBookmarks));
  },
);

export const clearBookmark = createAsyncThunk(
  'bookmark/clearBookmark',
  async (_, { dispatch }) => {
    localStorage.removeItem('bookmark');
    dispatch(setBookmarks([]));
  },
);

const bookmarkSlice = createSlice({
  name: 'bookmark',
  initialState: getBookmarks('1', '2566') ?? [],
  reducers: {
    setBookmarks: (_, action: PayloadAction<BookmarkItem[]>) => action.payload,
  },
  extraReducers: (builder) => {
    builder.addCase(loadBookmarks.fulfilled, (_, action) => action.payload);
  },
});

export const { setBookmarks } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;

export const selectBookmarks = (state: RootState) => state.bookmark;

export const selectIsBookmark = createSelector(
  [selectBookmarks, (_: RootState, subjectId: string) => subjectId],
  (bookmarks, subjectId) =>
    bookmarks.some((b: BookmarkItem) => b.subjectId === subjectId),
);

export const selectBookmarkDetail = createSelector(
  [selectBookmarks, (_: RootState, subjectId: string) => subjectId],
  (bookmarks, subjectId) =>
    bookmarks.find((b: BookmarkItem) => b.subjectId === subjectId),
);
