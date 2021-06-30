import { Container, Link, Typography } from '@material-ui/core';
import React, { useRef } from 'react';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AddIcon from '@material-ui/icons/Add';
import { Task, TaskStatusType } from 'helpers/type';
import TaskItem from './task_clickup';
import { UserInfo } from '../../../../helpers/type';
import { checkArray } from 'helpers/check_array';
import { useDispatch } from 'react-redux';
import { setTypeCreateTask } from 'pages/home/logic/home_actions';
import TaskNew from '../../../task/UI/task_new';
import { Roles } from 'constants/roles';
import { checkValidAccess } from 'helpers/check_valid_access';

interface InitProps {
  taskStatus: TaskStatusType;
  listTasks: Task[];
  user: UserInfo;
  companyID: string | '';
  departmentID: string | '';
  showTask: string;
  currentTaskStatus: string;
}

const TaskStatus = (props: InitProps) => {

  const { taskStatus, listTasks, user, companyID, departmentID, showTask, currentTaskStatus }: InitProps = props;
  const style = taskStatus?.title?.split(' ').join('-').toLowerCase();
  const dispatch = useDispatch();
  const newTaskRef = useRef<HTMLTitleElement>(null);

  const GenerateTasks = () => {
    const haveComanyAccess = checkValidAccess({
      rolesInCompany: user?.rolesInCompany,
      validAccesses: [Roles.COMPANY_MANAGER],
    });
    const haveDepartmentAccess = checkValidAccess({
      departmentID,
      rolesInDepartments: user?.rolesInDepartments,
      validAccesses: [Roles.DEPARTMENT_MANAGER],
    });
    const haveAccesses = user?.isAdmin || haveComanyAccess || haveDepartmentAccess;

    if (!haveAccesses || showTask === 'me') {
      return checkArray(listTasks) && listTasks.map((task) => {
        return (
          <TaskItem key={task?.taskStatusID?._id} {...task}/>
        );
      });
    }

    if (haveAccesses || showTask === 'everyone') {
      return checkArray(taskStatus.taskIDs) && taskStatus.taskIDs.map((task) => {

        return (
          <TaskItem key={task?._id} {...task}/>
        );
      });
    }

    return;
  };

  const scrollInput = () => {
    if (!newTaskRef.current) {
      return;
    }
    newTaskRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className='task-status'>
      <div className={`status ${style}`}>
        <Container className='status-left'>
          <Typography className='name-status'ref={newTaskRef}>{taskStatus?.title}</Typography>
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
        {
          currentTaskStatus === taskStatus?._id &&
           <TaskNew companyID={companyID} taskStatusID={taskStatus._id} />
        }
        {GenerateTasks()}
        {
          currentTaskStatus !== taskStatus?._id &&
          <div
            className='add-task'
            onClick={() => {
              dispatch(setTypeCreateTask(taskStatus?._id || ''));
              scrollInput();
            }}
          >
            <Link className='icon-add-task'><AddIcon /></Link>
            <Typography component='span' className='text-add-task'>NEW TASK</Typography>
          </div>
        }
      </div>
    </div>
  );
};

export default (TaskStatus);
