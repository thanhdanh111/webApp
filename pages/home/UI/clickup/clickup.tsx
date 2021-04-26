import { getTaskStatusThunkAction, getTasksByUserThunkAction } from 'pages/home/logic/home_reducer';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { DisappearedLoading } from 'react-loadingg';
import { checkArray } from 'helpers/check_array';
import TaskStatus from './statuses_clickup';
import NavClickUp from './nav_clickup';
import { TaskStatusType } from 'helpers/type';
import { Typography } from '@material-ui/core';

const BoardTasks: FunctionComponent = () => {
  const dispatch = useDispatch();
  const taskStatuses = useSelector((state: RootStateOrAny) => state.taskStatuses);
  const userProfile = useSelector((state: RootStateOrAny) => state.auth);
  const loading = taskStatuses.loading;
  const [companyID, setCompanyID] = useState('');
  const [departmentID, setDepartmentID] =  useState('');
  const [showTask, setShowTask] = useState('me');

  useEffect(() => {
    if (checkArray(userProfile.access)) {
      setCompanyID(userProfile.access[0]?.companyID);
      setDepartmentID(userProfile.access[0]?.departmentID);
    }

    void fetchData();
  }, [companyID, departmentID]);

  const fetchData = () => {
    dispatch(getTaskStatusThunkAction(companyID, departmentID));
    dispatch(getTasksByUserThunkAction(companyID, departmentID, userProfile));
  };

  const handleShowMe = (text) => {
    setShowTask(text);
  };

  const GenerateTaskStatuses = () => {
    return checkArray(taskStatuses.list) && taskStatuses.list.map((taskStatus: JSX.IntrinsicAttributes & TaskStatusType) => {
      return (
        <>
          <TaskStatus
            key={taskStatus._id}
            taskStatus={taskStatus}
            user={userProfile}
            companyID={companyID}
            departmentID={departmentID}
            listTasks={taskStatuses.listTasks}
            showTask={showTask}
          />
        </>
      );
    });
  };

  return (
    <div className='board'>
      <NavClickUp handleClick={handleShowMe} show={showTask}/>
      <div className='board-tasks'>
          {!loading &&
          <>
            {GenerateTaskStatuses()}
            <div className='add-task task-status'>
                <Typography component='span' className='add-task-text'>NEW TASK</Typography>
              </div>
          </>}
            {loading && <DisappearedLoading color={'#67cb48'}/>}
        </div>
      </div>
  );
};

export default (BoardTasks);
