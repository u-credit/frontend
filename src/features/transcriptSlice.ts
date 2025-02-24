import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from './store';
import {
  deleteTranscript,
  fetchTranscript,
  updateCalculateTranscript,
} from '@/api/transcriptApi';
import {
  CategoryProcessDto,
  GetTranscriptResponse,
  SubjectTranscriptDto,
  UpdateRecalculateDto,
} from '@/Interfaces/transcript.interface';

export interface TranscriptItem extends SubjectTranscriptDto {
  // categories: SubjectCategory;
}

interface TranscriptState {
  transcripts: TranscriptItem[] | null;
  groups: CategoryProcessDto[];
  matched: SubjectTranscriptDto[];
  unmatched: SubjectTranscriptDto[];
  initialPage: string;
  currentPage: string;
  loading?: boolean;
  error?: string | null;
}

const initialState: TranscriptState = {
  transcripts: null,
  groups: [],
  matched: [],
  unmatched: [],
  initialPage: '',
  currentPage: '',
};

export const fetchTranscriptSubject = createAsyncThunk(
  'transcript/fetch',
  async (_, { getState, dispatch }): Promise<GetTranscriptResponse> => {
    const response = await fetchTranscript();
    const data = response.data;

    if (!response.status || data.subjects.length === 0) {
      dispatch(setInitialPage('upload'));
      dispatch(setCurrentPage('upload'));
      return {
        subjects: [],
        groups: [],
        unmatched: [],
      };
    }
    dispatch(setInitialPage('summary'));
    dispatch(setCurrentPage('summary'));

    const matched = data.groups.map((group) => group.subjects).flat();
    dispatch(setmatched(matched));
    dispatch(setTranscriptData(data.subjects));
    dispatch(setGroups(data.groups));
    dispatch(setUnmatched(data.unmatched));
    return {
      subjects: data.subjects,
      groups: data.groups,
      unmatched: data.unmatched,
    };
  },
);

export const updateCalculateTranscriptApi = createAsyncThunk(
  'transcript/updateCalculate',
  async (update: UpdateRecalculateDto, { dispatch }) => {
    const data = (await updateCalculateTranscript(update)).data;
    const matched = data.groups.map((group) => group.subjects).flat();
    dispatch(setmatched(matched));
    dispatch(setTranscriptData(data.subjects));
    dispatch(setGroups(data.groups));
    dispatch(setUnmatched(data.unmatched));
    return data;
  },
);

export const deleteTranscriptApi = createAsyncThunk(
  'transcript/delete',
  async (_, { dispatch }) => {
    const res = await deleteTranscript();
    if (res.ok) {
      dispatch(setInitialPage('upload'));
      dispatch(setCurrentPage('upload'));
      dispatch(setTranscriptData([]));
    }
  },
);

const transcriptSlice = createSlice({
  name: 'transcript',
  initialState: initialState,
  reducers: {
    setTranscriptData(state, action) {
      state.transcripts = action.payload;
    },
    setmatched(state, action) {
      state.matched = action.payload;
    },
    setUnmatched(state, action) {
      state.unmatched = action.payload;
    },
    setGroups(state, action) {
      state.groups = action.payload;
    },
    setInitialPage(state, action) {
      state.initialPage = action.payload;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTranscriptSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTranscriptSubject.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchTranscriptSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load faculties';
      });
  },
});

export const selectHasTranscript = (state: RootState) =>
  state.transcript.transcripts && state.transcript.transcripts.length > 0;
export const selectTranscripts = (state: RootState) =>
  state.transcript.transcripts;

export const {
  setTranscriptData,
  setCurrentPage,
  setInitialPage,
  setmatched,
  setUnmatched,
  setGroups,
} = transcriptSlice.actions;
export default transcriptSlice.reducer;
