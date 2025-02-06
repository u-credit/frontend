'use client';
import { SubjectDto } from '@/Interfaces';
import {
  useState,
  createContext,
  ReactNode,
  useContext,
  Dispatch,
} from 'react';

interface CourseContextType {
  listSubjects: SubjectDto[];
  setListSubjects: Dispatch<SubjectDto[]>;
}

const CourseContext = createContext<CourseContextType | null>(null);

export function useCourseContext() {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourseContext must be used within a CourseProvider');
  }
  return context;
}

function CourseProvider({ children }: { children: ReactNode }) {
  const [listSubjects, setListSubjects] = useState<SubjectDto[]>([]);

  return (
    <CourseContext.Provider
      value={{
        listSubjects,
        setListSubjects,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export default CourseProvider;
