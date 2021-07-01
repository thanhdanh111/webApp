import React from 'react';
import BoardTasks from '../../task_boards/UI/task_boards';
import CheckInCheckOutStatistics from './statistics/statistics';
import TimeOffTab from './time_off/time_off';

const HomeUI = () => {
  return (
    <div className='home-content'>
      <BoardTasks />
      <CheckInCheckOutStatistics />
      <TimeOffTab />
    </div>
  );
};

export default HomeUI;
