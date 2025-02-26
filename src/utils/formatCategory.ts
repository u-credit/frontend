import { SubjectCategoryEnum } from '@/enums';
import { CategoryDto, CategoryItem } from '@/Interfaces';

export function formatCategory(category: string): string {
  if (category == SubjectCategoryEnum.MAJOR) return 'วิชาเฉพาะ';
  else if (category == SubjectCategoryEnum.GENERAL) return 'วิชาศึกษาทั่วไป';
  return '';
}

export function chipCategory(category: CategoryDto): string {
  let text = '';
  if (category.group_name) text += category.group_name;
  if (category.subgroup_name) text += ' + ' + category.subgroup_name;
  return text;
}

export function chipSeletedCategory(
  category: number | null,
  group: number | null,
  subgroup: number | null,
  childgroup: number | null,
  listCategory: any[],
): string {
  let categoryName = '';
  let groupName = '';
  let subgroupName = '';
  let childgroupName = '';

  for (const c of listCategory) {
    if (Number(c.category) === category) {
      categoryName = c.c_cat_name;
      if (!c.group) break;

      for (const g of c.group) {
        if (Number(g.group) === group) {
          groupName = g.c_group_name;
          if (!g.subgroup) break;

          for (const s of g.subgroup) {
            if (Number(s.subgroup) === subgroup) {
              subgroupName = s.c_subgroup_name;
              if (!s.children) break;

              for (const cg of s.children) {
                if (Number(cg.subgroup) === childgroup) {
                  childgroupName = cg.c_subgroup_name;
                  break;
                }
              }
              break;
            }
          }
          break;
        }
      }
      break;
    }
  }

  return [categoryName, groupName, subgroupName, childgroupName]
    .filter(Boolean)
    .join(' ');
}

export const getChipColor = (category: number): string => {
  if (category === 1) return 'info';
  else if (category === 2) return 'primary';
  else if (category === 3) return 'success';
  else if (category === 1) return '';
  return 'default';
};

export function chipCategoryItem(category: CategoryItem): string {
  let text = '';
  if (category.groupName) text += category.groupName;
  if (category.subgroupName) text += ' + ' + category.subgroupName;
  return text;
}
