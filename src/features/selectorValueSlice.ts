import { CurriGroup } from '@/Interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectorValueState {
  semester: string;
  year: string;
  curriGroup?: CurriGroup;
}

const initialState: SelectorValueState = {
  semester: '1',
  year: '2566',
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
});

export const { setSemester, setYear, setCurrigroup } =
  selectorValueSlice.actions;
export default selectorValueSlice.reducer;
