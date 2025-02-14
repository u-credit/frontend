import { CurriGroup } from '@/Interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
import { fetchActiveSetting } from './admin/semesterSettingsSlice';

interface SelectorValueState {
  semester: string;
  year: string;
  curriGroup?: CurriGroup;
}

const initialState: SelectorValueState = {
  semester: '',
  year: '',
};

const selectorValueSlice = createSlice({
  name: 'selectorValue',
  initialState,
  reducers: {
    setSemester: (state, action: PayloadAction<string>) => {
      state.semester = action.payload;
    },
    setYear: (state, action: PayloadAction<string>) => {
      state.year = action.payload;
    },
    setCurrigroup: (state, action: PayloadAction<CurriGroup>) => {
      state.curriGroup = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchActiveSetting.fulfilled, (state, action) => {
      if (action.payload?.data) {
        state.semester = String(action.payload.data.semester);
        state.year = String(action.payload.data.year);
      }
    });
  },
});

export const { setSemester, setYear, setCurrigroup } = selectorValueSlice.actions;
export const selectSemester = (state: RootState) => state.selectorValue.semester;
export const selectYear = (state: RootState) => state.selectorValue.year;
export default selectorValueSlice.reducer;
