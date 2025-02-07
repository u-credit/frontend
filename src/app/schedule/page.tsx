'use client';
import { Button } from '@mui/material';
import Timetable from './components/timetable/components/Timetable';
import Tabs from './components/tabs/tabs';
import DownloadButton from './components/downloadButton/Button';
import * as React from 'react';
import { RootState } from '@/features/store';
import {
  BookmarkItem,
  ListSubjectByIdsQueryParams,
  SubjectDto,
} from '@/Interfaces';
import { useCallback, useEffect, useState } from 'react';
import { fetchListSubjectByIds } from '@/api/subjectApi';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookmark } from '@/api/bookmarkApi';
import { setBookmarks } from '@/features/bookmark/bookmarkSlice';
import { selectIsAuthenticated } from '@/features/auth/authSlice';

export default function Home() {
  const dispatch = useDispatch();
  const { semester, year, curriGroup } = useSelector(
    (state: RootState) => state.selectorValue,
  );
  const bookmarks = useSelector((state: RootState) => state.bookmark);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [listSubjects, setListSubjects] = useState<SubjectDto[]>([]);
  const [sumCredit, setSumCredit] = useState(0);
  const [categoryCredit, setCategoryCredit] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    const loadBookmark = async () => {
      try {
        const data =
          (
            await fetchBookmark({
              semester: Number(semester),
              year: Number(year),
            })
          )?.data || [];

        dispatch(
          setBookmarks(
            data.map((item) => ({
              subjectId: item.subject_id,
              semester: Number(item.semester),
              year: Number(item.year),
              selectedSection: item.section,
              isShow: item.is_show,
            })),
          ),
        );
        // console.log(bookmarks)
      } catch (error) {
        console.error('Error loading bookmark:', error);
      }
    };

    if (isAuthenticated) {
      loadBookmark();
    }
  }, [dispatch, isAuthenticated, semester, year]);

  const loadSubjects = useCallback(async () => {
    if (bookmarks.length === 0) {
      setSumCredit(0);
      return;
    }

    const getSubjectParams = (): ListSubjectByIdsQueryParams => ({
      semester: Number(semester),
      year: Number(year),
      subjectIds: bookmarks.map((item: BookmarkItem) => item.subjectId),
      ...(curriGroup &&
        curriGroup.faculty.value &&
        curriGroup.department.value &&
        curriGroup.curriculum.value &&
        curriGroup.curriculumYear.value && {
          categoryFacultyId: curriGroup.faculty.value,
          categoryDepartmentId: curriGroup.department.value,
          categoryCurriculumId: curriGroup.curriculum.value,
          categoryCurriculumYear: curriGroup.curriculumYear.value,
        }),
    });

    const params = getSubjectParams();

    try {
      const response = await fetchListSubjectByIds(params);
      const newSubjects = response?.data || [];
      setListSubjects(newSubjects);

      let catCredit: { [key: string]: number } = {};
      response?.data?.forEach((subject) => {
        if (!subject?.category || !subject.category[0]?.subgroup_name) return;
        const key =
          subject.category[0].group_name + subject.category[0].subgroup_name;
        catCredit[key] = catCredit[key]
          ? catCredit[key] + subject.credit
          : subject.credit;
      });
      setCategoryCredit(catCredit);

      setSumCredit(
        listSubjects.reduce((acc, subject) => acc + subject.credit, 0),
      );
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  }, [bookmarks, curriGroup, semester, year]);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  return (
    <main className="flex flex-row bg-gray-100 min-h-[calc(100vh-48px)] w-full">
      <div className="bg-white w-full sm:mx-[80px] px-[20px] sm:px-[40px] sm:pt-[56px] pt-[20px]">
        <div className="w-full flex justify-between items-center">
          <div id="header-content" data-testid="header-content">
            ตารางเรียน
          </div>
          <div
            id="button-container"
            className="flex gap-[10px] mb-[20px]"
            data-testid="button-container"
          >
            <Button
              variant="outlined"
              sx={{ minWidth: '89px' }}
              data-testid="exam-schedule-button"
            >
              ตารางสอบ
            </Button>
            <DownloadButton />
          </div>
        </div>
        <div className="timetable-container">
          <Timetable
            subjects={listSubjects.filter((subject) =>
              bookmarks.some(
                (bookmark: BookmarkItem) =>
                  bookmark.subjectId === subject.subject_id && bookmark.isShow,
              ),
            )}
            section={bookmarks
              .filter((bookmark: BookmarkItem) => bookmark.isShow)
              .map((bookmark: BookmarkItem) => ({
                subjectId: bookmark.subjectId,
                selectedSection: bookmark.selectedSection,
              }))}
          />
        </div>

        <div className="text-primary-400 pt-5">
          หน่วยกิตรวมในตาราง {sumCredit} หน่วยกิต
        </div>

        <div className="my-[40px]">
          <Tabs
            listSubjects={listSubjects}
            sumCredit={sumCredit}
            categoryCredit={categoryCredit}
          />
        </div>
      </div>
    </main>
  );
}
