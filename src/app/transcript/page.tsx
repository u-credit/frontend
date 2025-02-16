'use client';
import { useEffect, useState } from 'react';
import UploadTranscriptPage from './components/UploadTranscriptPage';
import RecheckPage from './components/RecheckPage';
import { initSelectOption, SelectOption } from '@/types';
import { fetchListCategory } from '@/api/transcriptApi';
import SummaryPage from './components/SummaryPage';
import TranscriptProvider, {
  useTranscriptContext,
} from '@/app/contexts/TranscriptContext';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser } from '@/features/auth/authSlice';
import { AppDispatch, RootState } from '@/features/store';
import { setCurrentPage } from '@/features/transcriptSlice';
import { Loading } from '@/components';

export default function TranscriptWrapper() {
  return (
    <TranscriptProvider>
      <Transcript />
    </TranscriptProvider>
  );
}

function Transcript() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    setCategoryOptions,
    selectedCurriGroup,
    setListCategory,
    setSelectCategory,
  } = useTranscriptContext();
  const user = useSelector(selectUser);
  const currentState = useSelector(
    (state: RootState) => state.transcript.currentPage,
  );

  const [file, setFile] = useState<File | null>(null);

  const handleNext = (section: string) => {
    dispatch(setCurrentPage(section));
  };

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const params = {
          faculty: selectedCurriGroup.faculty.value || user?.faculty_id || '',
          department:
            selectedCurriGroup.department.value || user?.department_id || '',
          curriculum:
            selectedCurriGroup.curriculum.value || user?.curr2_id || '',
          curriculumYear:
            selectedCurriGroup.curriculumYear.value ||
            user?.curriculum_year ||
            '',
        };
        const resp = await fetchListCategory(params);
        const data = resp?.data || [];
        const categoryOptions: SelectOption[] = data.map((category: any) => ({
          label: category.c_cat_name,
          value: category.category,
          children: category.group?.map((group: any) => ({
            label: group.c_group_name,
            value: group.group,
            children: group?.subgroup?.map((subgroup: any) => ({
              label: subgroup.c_subgroup_name,
              value: subgroup.subgroup,
              children: subgroup.children?.map((childGroup: any) => ({
                label: childGroup.c_subgroup_name,
                value: childGroup.subgroup,
              })),
            })),
          })),
        }));
        setCategoryOptions(categoryOptions);
        setListCategory(resp.data);
      } catch (error) {
        console.log('error', error);
      }
    };

    loadCategory();
    setSelectCategory({
      category: initSelectOption(),
      group: initSelectOption(),
      subgroup: initSelectOption(),
      childgroup: initSelectOption(),
    });
  }, [selectedCurriGroup, user]);

  if (currentState === '') {
    return (
      <main className="p-10 bg-white">
        <Loading />
      </main>
    );
  }

  if (currentState === 'summary') {
    return <SummaryPage onNext={(state: string) => handleNext(state)} />;
  }

  return (
    <main className="flex flex-row bg-gray-100 min-h-[calc(100vh-48px)] w-full">
      <div className="w-full border-solid md:my-[10px]">
        <div className="bg-white h-full md:rounded-3xl p-10">
          {currentState === 'upload' && (
            <UploadTranscriptPage
              file={file}
              setFile={setFile}
              onNext={() => handleNext('recheck')}
            />
          )}
          {currentState === 'recheck' && (
            <RecheckPage file={file!} onNext={() => handleNext('summary')} />
          )}
          {currentState === 'pleaseLogin' && (
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-2xl font-bold">กรุณาเข้าสู่ระบบ</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
