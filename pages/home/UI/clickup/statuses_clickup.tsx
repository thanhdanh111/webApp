import { Container, Link, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AddIcon from '@material-ui/icons/Add';
import { TaskStatusType } from 'helpers/type';
import TaskItem from './task_clickup';
import { LoginValue } from '../../../../helpers/type';
import { isAdminOrManagerUser } from '../../../../helpers/check_role_user';
import { checkArray } from 'helpers/check_array';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { getTasksByUserThunkAction, HomeDataType } from 'pages/home/logic/home_reducer';

interface InitProps {
  taskStatus: TaskStatusType;
  taskStatusID: string;
  user: LoginValue;
  companyID: string | '';
  departmentID: string | '';
  showTask: string;
}

const TaskStatus = (props: InitProps) => {
  const { taskStatus, taskStatusID, user, companyID, departmentID, showTask }: InitProps = props;
  const style = taskStatus?.title?.split(' ').join('-').toLowerCase();
  const dispatch = useDispatch();
  const {
    listTasks,
  }: HomeDataType = useSelector((state: RootStateOrAny) => state.taskStatuses);

  useEffect(() => {
    void fetchData();
  }, []);

  const fetchData = () => {
    dispatch(getTasksByUserThunkAction(taskStatusID));
  };

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

export default (TaskStatus);
