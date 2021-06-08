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

interface InitProps {
  taskStatus: TaskStatusType;
  listTasks: Task[];
  user: LoginValue;
  companyID: string | '';
  departmentID: string | '';
  showTask: string;
}

const TaskStatus = (props: InitProps) => {

  const { taskStatus, listTasks, user, companyID, departmentID, showTask }: InitProps = props;
  const style = taskStatus?.title?.split(' ').join('-').toLowerCase();

  const GenerateTasks = () => {

    if (!isAdminOrManagerUser(user.access, companyID, departmentID) || showTask === 'me') {
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

    if (isAdminOrManagerUser(user.access, companyID, departmentID) || showTask === 'everyone') {
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
      {(provided) => {
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
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {GenerateTasks()}
              </div>
              <div className='add-task'>
                <Link className='icon-add-task'><AddIcon/></Link>
                <Typography component='span' className='text-add-task'>NEW TASK</Typography>
              </div>
            </div>
        </div>
        );
      }}
    </Droppable>
  );
};

export default (TaskStatus);
