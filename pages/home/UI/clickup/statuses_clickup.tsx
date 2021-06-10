import { Container, Link, Typography } from '@material-ui/core';
import React from 'react';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AddIcon from '@material-ui/icons/Add';
import { Task, TaskStatusType } from 'helpers/type';
import TaskItem from './task_clickup';
import { LoginValue } from '../../../../helpers/type';
import { isAdminOrManagerUser } from '../../../../helpers/check_role_user';
import { checkArray } from 'helpers/check_array';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { TaskFilteringState } from 'pages/home/logic/task_filtering_reducer';
import { RootStateOrAny, useSelector } from 'react-redux';

interface InitProps {
  taskStatus: TaskStatusType;
  listTasks: Task[];
  user: LoginValue;
  companyID: string | '';
  departmentID: string | '';
}

const TaskStatus = (props: InitProps) => {
  const taskFilter: TaskFilteringState = useSelector((state: RootStateOrAny) => state.taskFilter);
  const { taskStatus, listTasks, user, companyID, departmentID }: InitProps = props;
  const style = taskStatus?.title?.split(' ').join('-').toLowerCase();

  const GenerateTasks = () => {

    if (!isAdminOrManagerUser(user.access, companyID, departmentID) || taskFilter?.isMe) {
      return checkArray(listTasks) && listTasks.map((task, index) => {
        return (
          <Draggable
            key={task?._id}
            draggableId={task?._id}
            index={index}
          >
            {(provided) => {
              return (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >

                  <TaskItem key={task?.taskStatusID?._id} {...task}/>
                </div>
              );
            }}
          </Draggable>
        );
      });
    }

    if (isAdminOrManagerUser(user.access, companyID, departmentID) || taskFilter?.isEveryOne) {
      return checkArray(taskStatus.taskIDs) && taskStatus.taskIDs.map((task, index) => {
        return (
          <Draggable
            key={task?._id}
            draggableId={task?._id}
            index={index}
          >
          {(provided) => {
            return (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >

                <TaskItem key={task?.taskStatusID?._id} {...task}/>
              </div>
            );
          }}
          </Draggable>
        );
      });
    }

    return;
  };

  return (
    <Droppable droppableId={taskStatus?._id} type='TASK_STATUS'>
      {(provided) => (
        <div
          className='task-status'
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
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
            <div
            >
              {GenerateTasks()}
            </div>
            <div className='add-task'>
              <Link className='icon-add-task'><AddIcon/></Link>
              <Typography component='span' className='text-add-task'>NEW TASK</Typography>
            </div>
          </div>
        </div>
    )}
    </Droppable>
  );
};

export default (TaskStatus);
