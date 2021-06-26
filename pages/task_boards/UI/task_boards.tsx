import { createTaskStatusThunkAction, TaskBoardsType } from '../logic/task_boards_reducer';
import React, { FunctionComponent, useState } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { DisappearedLoading } from 'react-loadingg';
import TaskStatusUI from '../../task_statuses/UI/task_statuses';
import NavClickUp from './task_board_header';
import { Typography } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

const BoardTasks: FunctionComponent = () => {
  const {
    loading,
    currentTaskBoard,
  }: TaskBoardsType = useSelector((state: RootStateOrAny) => state.taskBoards);
  const dispatch = useDispatch();
  const [isAddStatus, setIsAddStatus] = useState(false);
  const [title, setTitle] = useState('');

  const GenerateTaskStatuses = () => {
    if (!currentTaskBoard) {
      return;
    }

    return currentTaskBoard?.taskStatusIDs?.map((each) => {
      return (
          <>
            <TaskStatusUI
              key={each}
              taskStatusID={each}
            />
          </>
      );
    },
    );
  };

  const addTaskStatusUI = () => {
    return (
      <div className='add-status-modal'>
        <input className='add-status-input' placeholder='STATUS NAME' onChange={(event) => setTitle(event.target.value)} />
        <div className='close-create-status' onClick={() => setIsAddStatus(false)}>
          <CloseIcon className='close-create-status-icon' />
        </div>
        <div className='submit-create-status' onClick={() => dispatch(createTaskStatusThunkAction(title))} >
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
              <div className='status'>
                {isAddStatus &&
                  addTaskStatusUI()}
                {!isAddStatus &&
                  <Typography component='span' className='add-task-text'  onClick={() => setIsAddStatus(true)}>
                    NEW STATUS
                  </Typography>
                }
              </div>
            </div>
          </>}
            {loading && <DisappearedLoading color={'#67cb48'}/>}
        </div>
      </div>
  );
};

export default (BoardTasks);
