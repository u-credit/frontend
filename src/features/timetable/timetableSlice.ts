import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TimetableState {
  conflictingSubjects: Set<string>;
}

const initialState: TimetableState = {
  conflictingSubjects: new Set(),
};

const timetableSlice = createSlice({
  name: 'timetable',
  initialState,
  reducers: {
    setConflictingSubjects: (state, action: PayloadAction<Set<string>>) => {
      state.conflictingSubjects = action.payload;
    },
  },
});

export const { setConflictingSubjects } = timetableSlice.actions;
export default timetableSlice.reducer;
