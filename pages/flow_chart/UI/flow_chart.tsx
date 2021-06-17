import PrimaryButtonUI from '@components/primary_button/primary_button';
import { useRouter } from 'next/router';
import React from 'react';

const FlowChart = () => {

  const router = useRouter();
  const pathname = router.pathname;

  const onPushToPage = (url: string) => {
    void router.push(`${pathname}/${url}`);
  };

  return (
    <div className='flowchart'>
      <h1 className='text-flowchart'>FlowCharts</h1>
      <div className='btn-new'>
        <PrimaryButtonUI
          title='+ FlowChart'
          handleClick={() => onPushToPage('new_flow_chart')}
        />
      </div>
    </div>
  );
};

export default FlowChart;
