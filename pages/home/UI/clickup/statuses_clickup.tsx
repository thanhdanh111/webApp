import { Container, Link, Typography } from '@material-ui/core';
import React from 'react';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AddIcon from '@material-ui/icons/Add';
import TaskItem from './task_clickup';
import { LoginValue, TaskStatus } from '../../../../helpers/type';
import { checkArray } from 'helpers/check_array';
import { RootStateOrAny,  useSelector } from 'react-redux';
import {  HomeDataType } from 'pages/home/logic/home_reducer';

interface InitProps {
  taskStatusID: TaskStatus;
}

const TaskStatusUI = (props: InitProps) => {
  const { taskStatusID }: InitProps = props;
  const { filteringTaskByUser }: HomeDataType = useSelector((state: RootStateOrAny) => state.taskStatuses);
  const { userID }: LoginValue = useSelector((state: RootStateOrAny) => state.auth);

  const style = taskStatusID?.title?.split(' ').join('-').toLowerCase();

  const GenerateTasks = () => {
    let taskIDs = taskStatusID?.taskIDs;

    if (!checkArray(taskIDs)) {
      return;
    }

    if (filteringTaskByUser) {
      taskIDs = taskIDs.filter((task) => {

        if (task.userIDs) {
          task.userIDs.filter((user) => user._id === userID);
        }

        return;
      });
    }

    taskIDs.map((task) => {
      return (
        <TaskItem key={task?._id} {...task}/>
      );
    });
  };

  return (
    <div className='task-status'>
        <div className={`status ${style}`}>
          <Container className='status-left'>
              <Typography className='name-status'>{taskStatusID?.title}</Typography>
              <Typography className='quality-task'>{taskStatusID?.taskIDs?.length}</Typography>
          </Container>
          <Container className='status-right'>
              <Link className='actions-status more-actions'><MoreHorizIcon/></Link>
              <Link className='actions-status add-action'><AddIcon /></Link>
          </Container>
        </div>
        <div className='status-task-list'>
          {GenerateTasks()}
          <div className='add-task'>
            <Link className='icon-add-task'><AddIcon/></Link>
            <Typography component='span' className='text-add-task'>NEW TASK</Typography>
          </div>
        </div>
    </div>
  );
};

export default (TaskStatusUI);
