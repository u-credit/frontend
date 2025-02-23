import { BookmarkItem, SubjectDto } from '@/Interfaces';
import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createSelector,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchListSubjectByIds } from '@/api/subjectApi';
import {
  formatBookmarkToItem,
  getCategoryCredit,
  getCurriGroupParam,
} from '@/utils';
import { fetchBookmark } from '@/api/bookmarkApi';

export interface BookmarkStateItem extends BookmarkItem {
  detail?: SubjectDto;
}
export interface BookmarkState {
  items: BookmarkStateItem[];
  backup: BookmarkStateItem[] | null;
  loading?: boolean;
  error?: string | null;
  isFirstFetch: boolean;
}

export const loadBackup = createAsyncThunk(
  'backup/loadBackup',
  async (_, { dispatch }) => {
    if (typeof window === 'undefined') {
      return [];
    }

    const backup = JSON.parse(localStorage.getItem('bookmark') || '{}');
    localStorage.setItem('backupBookmark', JSON.stringify(backup));
    dispatch(setBackup(backup));
    return backup;
  },
);

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

export const loadBookmarksApi = createAsyncThunk(
  'bookmark/loadBookmarks',
  async (_, { getState, dispatch }) => {
    const { semester, year, facultyId, curriculumId, curriculumYear } = (
      getState() as RootState
    ).selectorValue;

    try {
      const response = await fetchBookmark({
        semester: Number(semester),
        year: Number(year),
        withDetail: true,
        ...(facultyId &&
          curriculumId &&
          curriculumYear && {
            facultyId: facultyId,
            curriculumId: curriculumId,
            curriculumYear: curriculumYear,
          }),
      });
      const data = response?.data || [];
      const formatData = formatBookmarkToItem(data);
      saveBookmarks(semester, year, formatData);
      dispatch(setBookmarks(formatData));
      return formatData;
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      return [];
    }
  },
);

export const addBookmark = createAsyncThunk(
  'bookmark/addBookmark',
  async (bookmark: BookmarkStateItem, { getState, dispatch }) => {
    const { semester, year } = (getState() as RootState).selectorValue;
    const user = (getState() as RootState).auth.user;
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
        ...(user?.faculty_id && { categoryFacultyId: user?.faculty_id }),
        ...(user?.curr2_id && { categoryCurriculumId: user?.curr2_id }),
        ...(user?.curriculum_year && {
          categoryCurriculumYear: user?.curriculum_year,
        }),
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
  'bookmark/editBookmarks',
  async (updatedBookmarks: BookmarkStateItem[], { getState, dispatch }) => {
    const { semester, year } = (getState() as RootState).selectorValue;
    const currentBookmarks = getBookmarks(semester, year);

    const updatedMap = new Map(
      updatedBookmarks.map((bookmark) => [bookmark.subjectId, bookmark]),
    );

    const newBookmarks = currentBookmarks.map((b: BookmarkStateItem) =>
      updatedMap.has(b.subjectId)
        ? { ...b, ...updatedMap.get(b.subjectId) }
        : b,
    );

    saveBookmarks(semester, year, newBookmarks);
    dispatch(setBookmarks(newBookmarks));
  },
);

export const removeBookmark = createAsyncThunk(
  'bookmark/removeBookmark',
  async (subjectId: string, { getState, dispatch }) => {
    const { semester, year } = (getState() as RootState).selectorValue;
    const currentBookmarks = getBookmarks(semester, year);

    const bookmarkMap = new Map(
      currentBookmarks.map((b: BookmarkStateItem) => [b.subjectId, b]),
    );
    bookmarkMap.delete(subjectId);
    const updatedBookmarks: BookmarkStateItem[] = Array.from(
      bookmarkMap.values(),
    ) as BookmarkStateItem[];

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
    const { semester, year } = (getState() as RootState).selectorValue;
    const userCurriGroup = (getState() as RootState).faculty.userCurriGroup;
    const bookmarks = (getState() as RootState).bookmark
      .items as BookmarkStateItem[];

    if (bookmarks.length === 0) return;

    const subjectIds = bookmarks.map((b) => b.subjectId);
    const response = await fetchListSubjectByIds({
      semester: Number(semester),
      year: Number(year),
      subjectIds,
      ...getCurriGroupParam(userCurriGroup),
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

const initialState: BookmarkState = {
  items: [],
  backup: null,
  loading: false,
  error: null,
  isFirstFetch: false,
};

const bookmarkSlice = createSlice({
  name: 'bookmark',
  initialState: initialState,
  reducers: {
    setBookmarks: (state, action: PayloadAction<BookmarkStateItem[]>) => {
      state.items = action.payload;
    },
    setBackup: (state, action: PayloadAction<BookmarkStateItem[] | null>) => {
      state.backup = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadBookmarksApi.fulfilled, (state) => {
      if (!state.isFirstFetch) {
        state.isFirstFetch = true;
      }
    });

    builder.addMatcher(isPending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addMatcher(isFulfilled, (state) => {
      state.loading = false;
    });
    builder.addMatcher(isRejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Error occurred';
    });
  },
});

export const { setBookmarks, setBackup } = bookmarkSlice.actions;
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

export const selectIsBackupMatchBookmark = createSelector(
  [selectBookmarks, (_: RootState) => _.bookmark.backup],
  (bookmarks, backup) => JSON.stringify(bookmarks) === JSON.stringify(backup),
);
