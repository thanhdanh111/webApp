import React from 'react';
import BoardTasks from './clickup/clickup';
import CheckInCheckOutStatistics from './statistics/statistics';

const HomeUI = () => {
  return (
    <div className='home-content'>
      <BoardTasks />
      <CheckInCheckOutStatistics />
    </div>
  );
};

export default HomeUI;
