import { Row } from '@/app/transcript/components/SummaryTable';
import { BookmarkDto } from '@/Interfaces';
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
        const cat = tableData.find((c: Row) => c.id === item.category);
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
        subgroup?.requiredCredit && (subgroup.requiredCredit += item.credit1);
        subgroup?.creditToComplete &&
          (subgroup.creditToComplete += item.credit1);
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
        const cat = tableData.find((c: Row) => c.id === item.category);
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
  scheduleItem: BookmarkDto[],
): Row[] => {
  if (tableData && tableData.length > 0) {
    if (scheduleItem && scheduleItem.length > 0) {
      scheduleItem.forEach((item: BookmarkDto) => {
        const cat = tableData.find((c: Row) => c.id === item.category);
        cat?.scheduledCredit != undefined &&
          (cat.scheduledCredit += item.credit);

        const group = cat?.children?.find((g: Row) => g.id === item.group);
        group?.scheduledCredit != undefined &&
          (group.scheduledCredit += item.credit);

        const subgroup = group?.children?.find(
          (s: Row) => s.id === item.subgroup,
        );
        subgroup?.scheduledCredit != undefined &&
          (subgroup.scheduledCredit += item.credit);
      });
    }
  }
  return tableData;
};
