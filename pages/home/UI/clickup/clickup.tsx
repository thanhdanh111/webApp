import { HomeDataType } from 'pages/home/logic/home_reducer';
import React, { FunctionComponent, useState } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { DisappearedLoading } from 'react-loadingg';
import TaskStatusUI from './statuses_clickup';
import NavClickUp from './nav_clickup';
import { Typography } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

const BoardTasks: FunctionComponent = () => {
  const {
    loading,
    taskStatus,
  }: HomeDataType = useSelector((state: RootStateOrAny) => state.taskStatuses);
  const [isAddStatus, setIsAddStatus] = useState(false);

  const GenerateTaskStatuses = () => {
    if (!taskStatus) {
      return;
    }

    return Object.keys(taskStatus)?.map((key) => {
      return (
          <>
            <TaskStatusUI
              key={key}
              taskStatusID={taskStatus[key]}
            />
          </>
      );
    },
    );
  };

  const addTaskStatusUI = () => {
    return (
      <div className='add-status-modal'>
        <input placeholder='STATUS NAME' className='add-status-input' />
        <div className='close-create-status'>
          <CloseIcon className='close-create-status-icon' />
        </div>
        <div className='submit-create-status'>
          <CheckIcon className='submit-create-status-icon' />
        </div>
      </div>
    );
  };

  return (
    <div className='board'>
      <NavClickUp />
      <div className='board-tasks'>
          {!loading &&
          <>
            {GenerateTaskStatuses()}
            <div className='add-task task-status'>
              <div className='status' onClick={() => setIsAddStatus(true)}>
                {!isAddStatus ?
                  <Typography component='span' className='add-task-text'>NEW STATUS</Typography>
                : addTaskStatusUI()}
              </div>
            </div>
          </>}
            {loading && <DisappearedLoading color={'#67cb48'}/>}
        </div>
      </div>
  );
};

export default (BoardTasks);
