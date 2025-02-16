'use client';
import { CurriGroup } from '@/Interfaces';
import { initSelectOption, SelectOption } from '@/types';
import { useState, createContext, ReactNode, useContext } from 'react';
import { CategoryGroup, SubjectTranscriptDto } from '@/Interfaces';
import { RootState } from '@/features/store';
import { useSelector } from 'react-redux';

interface TranscriptContextType {
  categoryOptions: SelectOption[];
  setCategoryOptions: React.Dispatch<React.SetStateAction<SelectOption[]>>;
  selectedCurriGroup: CurriGroup;
  setSelectedCurriGroup: React.Dispatch<React.SetStateAction<CurriGroup>>;
  listCategory: any;
  setListCategory: React.Dispatch<React.SetStateAction<any>>;
  selectedCategory: CategoryGroup;
  setSelectCategory: React.Dispatch<React.SetStateAction<CategoryGroup>>;
  unmatchSubjects?: SubjectTranscriptDto[];
  setUnmatchSubjects: React.Dispatch<
    React.SetStateAction<SubjectTranscriptDto[]>
  >;
  matchSubjects?: SubjectTranscriptDto[];
  setMatchSubjects: React.Dispatch<
    React.SetStateAction<SubjectTranscriptDto[]>
  >;
}

const TranscriptContext = createContext<TranscriptContextType | null>(null);

export function useTranscriptContext() {
  const context = useContext(TranscriptContext);
  if (!context) {
    throw new Error(
      'useTranscriptContext must be used within a TranscriptProvider',
    );
  }
  return context;
}

function TranscriptProvider({ children }: { children: ReactNode }) {
  const facultyOptions = useSelector((state: RootState) => state.faculty.data);
  const [selectedCurriGroup, setSelectedCurriGroup] = useState<CurriGroup>({
    faculty: initSelectOption(),
    department: initSelectOption(),
    curriculum: initSelectOption(),
    curriculumYear: initSelectOption(),
  });

  const [selectedCategory, setSelectCategory] = useState<CategoryGroup>({
    category: initSelectOption(),
    group: initSelectOption(),
    subgroup: initSelectOption(),
    childgroup: initSelectOption(),
  });

  const [unmatchSubjects, setUnmatchSubjects] = useState<
    SubjectTranscriptDto[]
  >([]);

  const [matchSubjects, setMatchSubjects] = useState<SubjectTranscriptDto[]>(
    [],
  );

  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);
  const [listCategory, setListCategory] = useState<SelectOption[]>([]);

  const [transcriptSubject, setTranscriptSubject] = useState<
    SubjectTranscriptDto[]
  >([]);

  return (
    <TranscriptContext.Provider
      value={{
        categoryOptions,
        setCategoryOptions,
        selectedCurriGroup,
        setSelectedCurriGroup,
        listCategory,
        setListCategory,
        selectedCategory,
        setSelectCategory,
        unmatchSubjects,
        setUnmatchSubjects,
        matchSubjects,
        setMatchSubjects,
      }}
    >
      {children}
    </TranscriptContext.Provider>
  );
}

export default TranscriptProvider;
