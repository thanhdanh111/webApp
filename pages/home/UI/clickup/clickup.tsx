import { HomeDataType, getTaskBoardByIDThunkAction } from 'pages/home/logic/home_reducer';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { DisappearedLoading } from 'react-loadingg';
import { checkArray } from 'helpers/check_array';
import TaskStatus from './statuses_clickup';
import NavClickUp from './nav_clickup';
import { TaskStatusType } from 'helpers/type';
import { Typography } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

const BoardTasks: FunctionComponent = () => {
  const dispatch = useDispatch();
  const {
    selectTaskBoardID,
    selectTaskBoard,
    loading,
  }: HomeDataType = useSelector((state: RootStateOrAny) => state.taskStatuses);
  const authState = useSelector((state: RootStateOrAny) => state.auth);
  const companyID = authState?.extendedCompany?.companyID?._id;
  const departmentID = authState?.department?._id;
  const [showTask, setShowTask] = useState('me');
  const [isAddStatus, setIsAddStatus] = useState(false);

  useEffect(() => {
    void fetchData();
  }, [selectTaskBoardID]);

  const fetchData = () => {
    dispatch(getTaskBoardByIDThunkAction(selectTaskBoardID));
  };

  const handleShowMe = (text) => {
    setShowTask(text);
  };

  const GenerateTaskStatuses = () => {
    return checkArray(selectTaskBoard?.taskStatusIDs) && selectTaskBoard?.taskStatusIDs?.map(
      (taskStatus: JSX.IntrinsicAttributes & TaskStatusType) => {
        return (
          <>
            <TaskStatus
              key={taskStatus._id}
              taskStatus={taskStatus}
              user={authState}
              companyID={companyID}
              departmentID={departmentID}
              taskStatusID={taskStatus?._id}
              showTask={showTask}
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
      <NavClickUp handleClick={handleShowMe} show={showTask}/>
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
