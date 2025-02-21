'use client';
import {
  useState,
  createContext,
  ReactNode,
  useContext,
  Dispatch,
} from 'react';
import { Row } from '../transcript/components/summary/SummaryTable';
import { Review } from '@/Interfaces';

interface SummaryContextType {
  tableData: Row[];
  setTableData: Dispatch<Row[]>;
  myTsReview: Review[];
  setMyTsReview: Dispatch<Review[]>;
}

const SummaryContext = createContext<SummaryContextType | null>(null);

export function useSummaryContext() {
  const context = useContext(SummaryContext);
  if (!context) {
    throw new Error('useSummaryContext must be used within a SummaryProvider');
  }
  return context;
}

function SummaryProvider({ children }: { children: ReactNode }) {
  const [tableData, setTableData] = useState<Row[]>([]);
  const [myTsReview, setMyTsReview] = useState<Review[]>([]);
  return (
    <SummaryContext.Provider
      value={{
        tableData,
        setTableData,
        myTsReview,
        setMyTsReview,
      }}
    >
      {children}
    </SummaryContext.Provider>
  );
}

export default SummaryProvider;
