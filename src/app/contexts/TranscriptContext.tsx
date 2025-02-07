'use client';
import { CurriGroup } from '@/Interfaces';
import { initSelectOption, SelectOption } from '@/types';
import {
  useState,
  createContext,
  ReactNode,
  useContext,
  useEffect,
} from 'react';
import { mockSelectedCurriGroup } from '../transcript/components/mock';
import { CategoryGroup } from '@/Interfaces/transcript.interface';

interface TranscriptContextType {
  categoryOptions: SelectOption[];
  setCategoryOptions: React.Dispatch<React.SetStateAction<SelectOption[]>>;
  selectedCurriGroup: CurriGroup;
  setSelectedCurriGroup: React.Dispatch<React.SetStateAction<CurriGroup>>;
  listCategory: any;
  setListCategory: React.Dispatch<React.SetStateAction<any>>;
  selectedCategory: CategoryGroup;
  setSelectCategory: React.Dispatch<React.SetStateAction<CategoryGroup>>;
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
  // const [selectedCurriGroup, setSelectedCurriGroup] = useState<CurriGroup>(
  //   mockSelectedCurriGroup,
  // );

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

  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);
  const [listCategory, setListCategory] = useState<SelectOption[]>([]);

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
      }}
    >
      {children}
    </TranscriptContext.Provider>
  );
}

export default TranscriptProvider;
