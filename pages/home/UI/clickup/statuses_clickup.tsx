import { Container, Link, Typography } from '@material-ui/core';
import React from 'react';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AddIcon from '@material-ui/icons/Add';
import { Task, TaskStatusType } from 'helpers/type';
import TaskItem from './task_clickup';
import { LoginValue } from '../../../../helpers/type';
import { isAdminOrManagerUser } from '../../../../helpers/check_role_user';
import { checkArray } from 'helpers/check_array';
import AddTask from './add_clickup';
import { useDispatch } from 'react-redux';
import { setTypeCreateTask } from 'pages/home/logic/home_actions';

interface InitProps {
  taskStatus: TaskStatusType;
  listTasks: Task[];
  user: LoginValue;
  companyID: string | '';
  departmentID: string | '';
  showTask: string;
  typeCreateTask: string;
}

const TaskStatus = (props: InitProps) => {

  const { taskStatus, listTasks, user, companyID, departmentID, showTask, typeCreateTask }: InitProps = props;
  const style = taskStatus?.title?.split(' ').join('-').toLowerCase();
  const dispatch = useDispatch();

  const GenerateTasks = () => {

    if (!isAdminOrManagerUser(user.access, companyID, departmentID) || showTask === 'me') {
      return checkArray(listTasks) && listTasks.map((task) => {
        return (
          <TaskItem key={task?.taskStatusID?._id} {...task}/>
        );
      });
    }

    if (isAdminOrManagerUser(user.access, companyID, departmentID) || showTask === 'everyone') {
      return checkArray(taskStatus.taskIDs) && taskStatus.taskIDs.map((task) => {

        return (
          <TaskItem key={task?._id} {...task}/>
        );
      });
    }

    return;
  };

  return (
    <div className='task-status'>
      <div className={`status ${style}`}>
        <Container className='status-left'>
          <Typography className='name-status'>{taskStatus?.title}</Typography>
          <Typography className='quality-task'>{taskStatus?.taskIDs.length}</Typography>
        </Container>
        <Container className='status-right'>
          <Link className='actions-status more-actions'><MoreHorizIcon /></Link>
          <Link
            className='actions-status add-action'
            onClick={() => dispatch(setTypeCreateTask(taskStatus?._id || ''))}
          >
            <AddIcon />
          </Link>
        </Container>
      </div>
      <div className='status-task-list'>
        {GenerateTasks()}
        {
          typeCreateTask === taskStatus?._id ? <AddTask companyID={companyID} taskStatusID={taskStatus._id} /> : <div className='add-task' onClick={() => dispatch(setTypeCreateTask(taskStatus?._id || ''))}>
            <Link className='icon-add-task'><AddIcon /></Link>
            <Typography component='span' className='text-add-task'>NEW TASK</Typography>
          </div>
        }
      </div>
    </div>
  );
};

export default (TaskStatus);
