import { Container, Link, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AddIcon from '@material-ui/icons/Add';
import TaskItem from './task_clickup';
import { LoginValue } from '../../../../helpers/type';
import { checkArray } from 'helpers/check_array';
import { RootStateOrAny,  useDispatch,  useSelector } from 'react-redux';
import {  getTaskStatusThunkAction, HomeDataType } from 'pages/home/logic/home_reducer';
import { DisappearedLoading } from 'react-loadingg';

interface InitProps {
  taskStatusID: string;
}

const TaskStatusUI = (props: InitProps) => {
  const { taskStatusID }: InitProps = props;
  const { filteringTaskByUser, taskStatus, loading }: HomeDataType = useSelector((state: RootStateOrAny) => state.taskStatuses);
  const { userID }: LoginValue = useSelector((state: RootStateOrAny) => state.auth);
  const dispatch = useDispatch();

  const style = taskStatus && taskStatus[taskStatusID]?.title?.split(' ').join('-').toLowerCase();

  useEffect(() => {
    dispatch(getTaskStatusThunkAction(taskStatusID));
  }, []);

  const GenerateTasks = () => {
    let taskIDs = taskStatus[taskStatusID]?.taskIDs;

    if (!checkArray(taskIDs)) {
      return;
    }

    if (filteringTaskByUser) {
      taskIDs = taskIDs.filter((task) => {

        if (task.userIDs && task.userIDs.length) {
          const ownerTask = task.userIDs.find((user) => {
            const id = user?._id ? user._id : user;

            return id === userID;
          });

          return ownerTask;
        }

        return false;
      });
    }

    return taskIDs.map((task) => {
      return (
        <TaskItem key={task._id} task={task}/>
      );
    });
  };

  return (
    <div className='task-status'>
      {(taskStatus && !loading) &&
        <>
          <div className={`status ${style}`}>
            <Container className='status-left'>
                <Typography className='name-status'>{taskStatus[taskStatusID]?.title}</Typography>
                <Typography className='quality-task'>{taskStatus[taskStatusID]?.taskIDs?.length}</Typography>
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
        </>
      }
      {loading && <DisappearedLoading color={'#67cb48'}/>}
    </div>
  );
};

export default (TaskStatusUI);
