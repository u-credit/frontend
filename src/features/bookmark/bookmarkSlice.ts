import { BookmarkItem, SubjectDto } from '@/Interfaces';
import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchListSubjectByIds } from '@/api/subjectApi';
import { getCategoryCredit, getCurriGroupParam } from '@/utils';

export interface BookmarkStateItem extends BookmarkItem {
  detail?: SubjectDto;
}
export interface BookmarkState {
  items: BookmarkStateItem[];
}

const getBookmarks = (semester: string, year: string) => {
  if (typeof window === 'undefined') {
    return [];
  }
  const bookmarks = JSON.parse(localStorage.getItem('bookmark') || '{}');
  const b = bookmarks[`${semester}${year}`];
  return b ?? [];
};

export const saveBookmarks = (
  semester: string,
  year: string,
  data: BookmarkStateItem[],
) => {
  const storedBookmarks = localStorage.getItem('bookmark');
  const bookmarks = storedBookmarks ? JSON.parse(storedBookmarks) : {};
  bookmarks[`${semester}${year}`] = data;
  localStorage.setItem('bookmark', JSON.stringify(bookmarks));
};

export const loadBookmarks = createAsyncThunk(
  'bookmark/loadBookmarks',
  async (_, { getState, dispatch }) => {
    const { semester, year } = (getState() as RootState).selectorValue;
    const b = getBookmarks(semester, year);
    dispatch(setBookmarks(b));
  },
);

export const addBookmark = createAsyncThunk(
  'bookmark/addBookmark',
  async (bookmark: BookmarkStateItem, { getState, dispatch }) => {
    const { semester, year, curriGroup } = (getState() as RootState)
      .selectorValue;
    const currentBookmarks = getBookmarks(semester, year);

    if (
      !currentBookmarks.some(
        (b: BookmarkStateItem) => b.subjectId === bookmark.subjectId,
      )
    ) {
      const updatedBookmarks = [...currentBookmarks, bookmark];
      const response = await fetchListSubjectByIds({
        semester: Number(semester),
        year: Number(year),
        subjectIds: [bookmark.subjectId],
        ...getCurriGroupParam(curriGroup),
      });

      if (response.data.length > 0) {
        const detail = response.data[0];

        const updatedBookmarksWithDetail = updatedBookmarks.map(
          (b: BookmarkStateItem) =>
            b.subjectId === bookmark.subjectId ? { ...b, detail: detail } : b,
        );

        saveBookmarks(semester, year, updatedBookmarksWithDetail);
        dispatch(setBookmarks(updatedBookmarksWithDetail));
      } else {
        saveBookmarks(semester, year, updatedBookmarks);
        dispatch(setBookmarks(updatedBookmarks));

        console.log(
          'No subject details found for subjectId:',
          bookmark.subjectId,
        );
      }
    }
  },
);

export const editBookmark = createAsyncThunk(
  'bookmark/editBookmark',
  async (updatedBookmark: BookmarkStateItem, { getState, dispatch }) => {
    const { semester, year } = (getState() as RootState).selectorValue;
    const currentBookmarks = getBookmarks(semester, year);
    const updatedBookmarks = currentBookmarks.map((b: BookmarkStateItem) =>
      b.subjectId === updatedBookmark.subjectId
        ? {
            subjectId: updatedBookmark.subjectId,
            semester: updatedBookmark.semester,
            year: updatedBookmark.year,
            section: updatedBookmark.section ?? b.section ?? null,
            isShow: updatedBookmark.isShow ?? b.isShow ?? false,
            detail: updatedBookmark.detail ?? b.detail ?? null,
            category: updatedBookmark.category ?? b.category ?? null,
            group: updatedBookmark.group ?? b.group ?? null,
            subgroup: updatedBookmark.subgroup ?? b.subgroup ?? null,
          }
        : b,
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
      (b: BookmarkStateItem) => b.subjectId !== subjectId,
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

export const updateBookmarksOnCurriChange = createAsyncThunk(
  'bookmark/updateBookmarksOnCurriChange',
  async (_, { getState, dispatch }) => {
    const { semester, year, curriGroup } = (getState() as RootState)
      .selectorValue;
    const bookmarks = (getState() as RootState).bookmark.items;

    if (bookmarks.length === 0) return;

    const subjectIds = bookmarks.map((b) => b.subjectId);
    const response = await fetchListSubjectByIds({
      semester: Number(semester),
      year: Number(year),
      subjectIds,
      ...getCurriGroupParam(curriGroup),
    });

    if (response.data.length > 0) {
      const updatedBookmarks = bookmarks.map((b) => {
        const newDetail = response.data.find(
          (d) => d.subject_id === b.subjectId,
        );
        return newDetail ? { ...b, detail: newDetail } : b;
      });

      saveBookmarks(semester, year, updatedBookmarks);
      dispatch(setBookmarks(updatedBookmarks));
    }
  },
);

const initialState: BookmarkState = { items: [] };

const bookmarkSlice = createSlice({
  name: 'bookmark',
  initialState: initialState,
  reducers: {
    setBookmarks: (state, action: PayloadAction<BookmarkStateItem[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadBookmarks.fulfilled, (_, action) => action.payload);
  },
});

export const { setBookmarks } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;

export const selectBookmarks = (state: RootState) => state.bookmark.items;
export const selectScheduledItems = (state: RootState) =>
  (state.bookmark.items ?? []).filter((b) => Boolean(b.isShow));

export const selectIsBookmark = createSelector(
  [selectBookmarks, (_: RootState, subjectId: string) => subjectId],
  (bookmarks, subjectId) =>
    bookmarks.some((b: BookmarkStateItem) => b.subjectId === subjectId),
);

export const selectBookmarkDetail = createSelector(
  [selectBookmarks, (_: RootState, subjectId: string) => subjectId],
  (bookmarks, subjectId) =>
    bookmarks.find((b: BookmarkStateItem) => b.subjectId === subjectId),
);

export const summaryCategoryBookmark = createSelector(
  [selectBookmarks],
  (
    bookmarks,
  ): {
    categoryCredit: { [key: string]: number };
    total: number;
  } => {
    const { categoryCredit, total } = getCategoryCredit(bookmarks);
    return { categoryCredit, total };
  },
);

export const summaryCategoryShedule = createSelector(
  [selectScheduledItems],
  (
    bookmarks,
  ): {
    categoryCredit: { [key: string]: number };
    total: number;
  } => {
    const { categoryCredit, total } = getCategoryCredit(bookmarks);
    return { categoryCredit, total };
  },
);
