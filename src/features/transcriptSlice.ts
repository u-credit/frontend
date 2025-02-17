import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from './store';
import { deleteTranscript, fetchTranscript } from '@/api/transcriptApi';
import { SubjectTranscriptDto } from '@/Interfaces/transcript.interface';
import { SubjectDto } from '@/Interfaces';
import { fetchListSubjectByIds } from '@/api/subjectApi';

export interface TranscriptItem extends SubjectTranscriptDto {
  detail?: SubjectDto;
}

interface TranscriptState {
  transcripts: TranscriptItem[];
  initialPage: string;
  currentPage: string;
  loading?: boolean;
  error?: string | null;
}

const initialState: TranscriptState = {
  transcripts: [],
  initialPage: '',
  currentPage: '',
};

export const fetchTranscriptSubject = createAsyncThunk(
  'transcript/fetch',
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { semester, year, facultyId, curriculumId, curriculumYear } =
      state.selectorValue || {};

    const response = await fetchTranscript();
    const data = response.data?.subjects || [];

    if (data.length === 0) {
      dispatch(setInitialPage('upload'));
      dispatch(setCurrentPage('upload'));
      return [];
    }
    dispatch(setInitialPage('summary'));
    dispatch(setCurrentPage('summary'));

    const subjectIds = data.map((item) => item.subject_id);
    const detailResponse = await fetchListSubjectByIds({
      semester: Number(semester),
      year: Number(year),
      subjectIds,
      ...(facultyId &&
        curriculumId &&
        curriculumYear && {
          categoryFacultyId: facultyId,
          categoryCurriculumId: curriculumId,
          categoryCurriculumYear: curriculumYear,
        }),
    });

    const detailMap = new Map(
      detailResponse.data.map((subject) => [subject.subject_id, subject]),
    );

    const updatedWithDetail = data.map((item) => ({
      ...item,
      detail: detailMap.get(item.subject_id),
    }));

    return updatedWithDetail;
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
        state.transcripts = action.payload;
        state.loading = false;
      })
      .addCase(fetchTranscriptSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load faculties';
      });
  },
});

export const selectHasTranscript = (state: RootState) =>
  state.transcript.transcripts.length > 0;
export const selectTranscripts = (state: RootState) =>
  state.transcript.transcripts;

export const { setTranscriptData, setCurrentPage, setInitialPage } =
  transcriptSlice.actions;
export default transcriptSlice.reducer;
