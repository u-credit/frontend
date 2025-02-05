import React from 'react';
import TabsComponent from '@/components/Tabs';
import SavedItems from './savedItems';
import { SubjectDto } from '@/Interfaces';

interface TabsProps {
  listSubjects: SubjectDto[];
  sumCredit: number;
  categoryCredit: { [key: string]: number };
}

const Tabs: React.FC<TabsProps> = ({ listSubjects, sumCredit, categoryCredit }) => {
  const customTabs = [
    {
      label: 'รายการที่บันทึกไว้',
      content: (
        <SavedItems
          listSubjects={listSubjects}
          sumCredit={sumCredit}
          categoryCredit={categoryCredit}
        />
      ),
    },
    { label: 'รายวิชาที่แนะนำสำหรับคุณ', content: 'Content for Tab B' },
  ];
  return (
    <div>
      <TabsComponent tabs={customTabs} />
    </div>
  );
};

export default Tabs;
