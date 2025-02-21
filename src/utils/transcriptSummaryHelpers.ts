import { SummarySubject } from '@/app/transcript/components/summary/SummarySubjectCard';
import { Row } from '@/app/transcript/components/summary/SummaryTable';
import { BookmarkStateItem } from '@/features/bookmark/bookmarkSlice';
import { ScheduleStateItem } from '@/features/scheduleSlice';
import { TranscriptItem } from '@/features/transcriptSlice';
import {
  RequiredCreditDto,
  SubjectTranscriptDto,
} from '@/Interfaces/transcript.interface';

export const formatCategoryForTranscript = (category: any): Row[] => {
  if (category && category.length > 1) {
    const categoryData: Row[] = [];
    let initCategory: Row;
    let initGroup: Row;
    let initSubgroup: Row;
    let initChildren: Row;
    category.forEach((cat: any) => {
      const groupData: Row[] = [];
      cat.group.forEach((group: any) => {
        const subgroupData: Row[] = [];
        group.subgroup.forEach((subgroup: any) => {
          const childrenData: Row[] = [];
          subgroup?.children?.forEach((children: any) => {
            initChildren = {
              id: children.subgroup,
              name: children.c_subgroup_name,
              requiredCredit: 0,
              currentCredit: 0,
              creditToComplete: 0,
              scheduledCredit: 0,
            };
            childrenData.push(initChildren);
          });
          initSubgroup = {
            id: subgroup.subgroup,
            name: subgroup.c_subgroup_name,
            requiredCredit: 0,
            currentCredit: 0,
            creditToComplete: 0,
            scheduledCredit: 0,
            ...(childrenData &&
              childrenData.length > 0 && { children: childrenData }),
          };
          subgroupData.push(initSubgroup);
        });

        initGroup = {
          id: group.group,
          name: group.c_group_name,
          requiredCredit: 0,
          currentCredit: 0,
          creditToComplete: 0,
          scheduledCredit: 0,
          ...(subgroupData &&
            subgroupData.length > 0 && { children: subgroupData }),
        };
        groupData.push(initGroup);
      });

      initCategory = {
        id: cat.category,
        name: cat.c_cat_name,
        requiredCredit: 0,
        currentCredit: 0,
        creditToComplete: 0,
        scheduledCredit: 0,
        ...(groupData && groupData.length > 0 && { children: groupData }),
      };
      categoryData.push(initCategory);
    });

    return categoryData;
  }
  return [];
};

export const calculateRequiredCredit = (
  tableData: Row[],
  requiredCreditItem: RequiredCreditDto[],
): Row[] => {
  if (tableData && tableData.length > 0) {
    if (requiredCreditItem && requiredCreditItem.length > 0) {
      requiredCreditItem.forEach((item: RequiredCreditDto) => {
        const cat = tableData.find((c: Row) => c.id === Number(item.category));
        cat?.requiredCredit != undefined &&
          (cat.requiredCredit += item.credit1);
        cat?.creditToComplete != undefined &&
          (cat.creditToComplete += item.credit1);

        const group = cat?.children?.find((g: Row) => g.id === item.group);
        group?.requiredCredit != undefined &&
          (group.requiredCredit += item.credit1);
        group?.creditToComplete != undefined &&
          (group.creditToComplete += item.credit1);

        const subgroup = group?.children?.find(
          (s: Row) => s.id === item.subgroup,
        );
        subgroup?.requiredCredit != undefined &&
          (subgroup.requiredCredit += item.credit1);
        subgroup?.creditToComplete != undefined &&
          (subgroup.creditToComplete += item.credit1);

        const children = subgroup?.children?.find(
          (c: Row) => c.id === item.subgroup,
        );
        children?.requiredCredit != undefined &&
          (children.requiredCredit += item.credit1);
        children?.creditToComplete != undefined &&
          (children.creditToComplete += item.credit1);
      });
    }
  }
  return tableData;
};

export const calculateCurrentCredit = (
  tableData: Row[],
  currentCreditItem: SubjectTranscriptDto[],
): Row[] => {
  if (tableData && tableData.length > 0) {
    if (currentCreditItem && currentCreditItem.length > 0) {
      currentCreditItem.forEach((item: SubjectTranscriptDto) => {
        const cat = tableData.find((c: Row) => c.id === Number(item.category));
        cat?.currentCredit != undefined && (cat.currentCredit += item.credit);
        cat?.creditToComplete != undefined &&
          (cat.creditToComplete -= item.credit);

        const group = cat?.children?.find((g: Row) => g.id === item.group);
        group?.currentCredit != undefined &&
          (group.currentCredit += item.credit);
        group?.creditToComplete != undefined &&
          (group.creditToComplete -= item.credit);

        const subgroup = group?.children?.find(
          (s: Row) => s.id === item.subgroup,
        );
        subgroup?.currentCredit != undefined &&
          (subgroup.currentCredit += item.credit);
        subgroup?.creditToComplete != undefined &&
          (subgroup.creditToComplete -= item.credit);
      });
    }
  }
  return tableData;
};

export const calculateScheduledCredit = (
  tableData: Row[],
  scheduleItem: ScheduleStateItem[],
): Row[] => {
  if (tableData && tableData.length > 0) {
    if (scheduleItem && scheduleItem.length > 0) {
      scheduleItem.forEach((item: ScheduleStateItem) => {
        const cat = tableData.find((c: Row) => c.id === Number(item.category));
        cat?.scheduledCredit != undefined &&
          (cat.scheduledCredit += item.credit ?? 0);

        const group = cat?.children?.find(
          (g: Row) => g.id === Number(item.group),
        );
        group?.scheduledCredit != undefined &&
          (group.scheduledCredit += item.credit ?? 0);

        const subgroup = group?.children?.find(
          (s: Row) => s.id === Number(item.subgroup),
        );
        subgroup?.scheduledCredit != undefined &&
          (subgroup.scheduledCredit += item.credit ?? 0);
      });
    }
  }
  return tableData;
};

export const formatDisplayCalculation = (value: number): string => {
  if (value < 0) return 'เกิน ' + Math.abs(value).toString() + ' หน่วย';
  return value.toString();
};

export const findStartEnd = (transcriptSubject: SubjectTranscriptDto[]) => {
  let startSemester: number = 0,
    startYear: number = 0,
    endSemester: number = 0,
    endYear: number = 0;

  transcriptSubject.forEach((subject) => {
    if (subject.year && subject.semester) {
      if (!startYear) {
        startYear = subject.year;
        startSemester = subject.semester;
      }
      if (!endYear) {
        endYear = subject.year;
        endSemester = subject.semester;
      }

      if (subject.year < startYear) {
        startYear = subject.year;
        startSemester = subject.semester;
      } else if (
        subject.year === startYear &&
        subject.semester < startSemester
      ) {
        startSemester = subject.semester;
      }

      if (subject.year > endYear) {
        endYear = subject.year;
        endSemester = subject.semester;
      } else if (subject.year === endYear && subject.semester > endSemester) {
        endSemester = subject.semester;
      }
    }
  });

  return { startSemester, startYear, endSemester, endYear };
};

/*
export const formatBookmarkStateItemToSummarySubject = (
  bookmark: BookmarkStateItem[],
): SummarySubject[] => {
  return bookmark.map<SummarySubject>((item: BookmarkStateItem) => {
    return {
      subject_id: item.detail?.subject_id || '',
      subject_tname: item.detail?.subject_thai_name || '',
      subject_ename: item.detail?.subject_english_name || '',
      category: item.category || undefined,
      group: item.group || undefined,
      subgroup: item.subgroup || undefined,
      childgroup: item.childgroup || undefined,
      credit: item.detail?.credit || 0,
      semester: item.semester || null,
      year: item.year || null,
      categories: item.detail?.category || [],
    };
  });
};*/

export const formatTranscriptItemToSummarySubject = (
  transcript: TranscriptItem[],
): SummarySubject[] => {
  return transcript.map<SummarySubject>((item: TranscriptItem) => {
    return {
      subject_id: item.subject_id || '',
      subject_tname: item.subject_tname || '',
      subject_ename: item.subject_ename || '',
      category: item.category || undefined,
      group: item.group || undefined,
      subgroup: item.subgroup || undefined,
      childgroup: item.childgroup || undefined,
      credit: item.credit || 0,
      semester: item.semester || null,
      year: item.year || null,
      categories: item.categories || [],
    };
  });
};

export const formatScheduleStateItemToSummarySubject = (
  schedule: ScheduleStateItem[],
): SummarySubject[] => {
  return schedule?.map<SummarySubject>((item: ScheduleStateItem) => {
    return {
      subject_id: item.subject_id || '',
      subject_tname: item.subject_tname || '',
      subject_ename: item.subject_ename || '',
      category: item.category || undefined,
      group: item.group || undefined,
      subgroup: item.subgroup || undefined,
      childgroup: item.childgroup || undefined,
      credit: item.credit || 0,
      semester: Number(item.semester) || null,
      year: Number(item.year) || null,
      categories: item.categories || [],
    };
  });
};
