import { Container, Link, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AddIcon from '@material-ui/icons/Add';
import TasksUI from '../../tasks/UI/tasks';
import { LoginValue } from '../../../helpers/type';
import { RootStateOrAny,  useDispatch,  useSelector } from 'react-redux';
import {  getTaskStatusThunkAction, TaskBoardsType } from 'pages/task_boards/logic/task_boards_reducer';
import { DisappearedLoading } from 'react-loadingg';

interface InitProps {
  taskStatusID: string;
}

const TaskStatusUI = (props: InitProps) => {
  const { taskStatusID }: InitProps = props;
  const { filteringTaskByUser, taskStatus, loading }: TaskBoardsType = useSelector((state: RootStateOrAny) => state.taskBoards);
  const { userID }: LoginValue = useSelector((state: RootStateOrAny) => state.auth);
  const dispatch = useDispatch();

  const style = taskStatus && taskStatus[taskStatusID]?.title?.split(' ').join('-').toLowerCase();

  useEffect(() => {
    dispatch(getTaskStatusThunkAction(taskStatusID));
  }, []);

  const TaskStatusContent = () => {
    let taskIDs = taskStatus[taskStatusID]?.taskIDs;

    if (filteringTaskByUser) {
      taskIDs = taskIDs?.filter((task) => {

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

    return (
      <>
        <div className={`status ${style}`}>
          <Container className='status-left'>
              <Typography className='name-status'>{taskStatus[taskStatusID]?.title}</Typography>
              <Typography className='quality-task'>{taskIDs?.length}</Typography>
          </Container>
          <Container className='status-right'>
              <Link className='actions-status more-actions'><MoreHorizIcon/></Link>
              <Link className='actions-status add-action'><AddIcon /></Link>
          </Container>
        </div>
        <div className='status-task-list'>
          {taskIDs?.map((task) => (
            <TasksUI key={task._id} task={task}/>
          ))}
          <div className='task-status add-task'>
            <Link className='icon-add-task'><AddIcon/></Link>
            <Typography component='span' className='text-add-task'>NEW TASK</Typography>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className='task-status'>
      {(taskStatus && !loading) &&
        TaskStatusContent()
      }
      {loading && <DisappearedLoading color={'#67cb48'}/>}
    </div>
  );
};

export default (TaskStatusUI);
