import { Container, Link, Typography } from '@material-ui/core';
import React from 'react';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AddIcon from '@material-ui/icons/Add';
import { TaskStatusType } from 'helpers/type';
import TaskItem from './task_clickup';

const TaskStatus = (props: TaskStatusType) => {

  const { title, taskIDs }: TaskStatusType = props;

  const style = title?.split(' ').join('-').toLowerCase();

  const GenerateTasks = () => {
    return taskIDs.map((task) => {
      return (
        <TaskItem key={task._id} {...task}/>
      );
    });
  };

  return (
        <div className='task-status'>
            <div className={`status ${style}`}>
              <Container className='status-left'>
                  <Typography className='name-status'>{title}</Typography>
                  <Typography className='quality-task'>{taskIDs.length}</Typography>
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
