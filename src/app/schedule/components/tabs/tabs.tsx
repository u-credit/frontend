import React from 'react';
import TabsComponent from '@/components/Tabs';
import SavedItems from './savedItems';
import RecommendItems from './recommendItems';

interface TabsProps {
  sumCredit: number;
  categoryCredit: { [key: string]: number };
}

const Tabs: React.FC<TabsProps> = ({ sumCredit, categoryCredit }) => {
  const customTabs = [
    {
      label: 'รายการที่บันทึกไว้',
      content: (
        <SavedItems sumCredit={sumCredit} categoryCredit={categoryCredit} />
      ),
    },
    { label: 'รายวิชาที่แนะนำสำหรับคุณ', content: <RecommendItems /> },
  ];
  return (
    <div>
      <TabsComponent tabs={customTabs} />
    </div>
  );
};

export default Tabs;
