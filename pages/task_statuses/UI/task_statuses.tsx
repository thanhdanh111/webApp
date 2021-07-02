import { Container, Link, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import AddIcon from '@material-ui/icons/Add';
import TasksUI from '../../tasks/UI/tasks';
import { RootStateOrAny,  useDispatch,  useSelector } from 'react-redux';
import {  getTaskStatusThunkAction, TaskBoardsType } from 'pages/task_boards/logic/task_boards_reducer';
import { DisappearedLoading } from 'react-loadingg';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { UserInfoType } from 'helpers/type';
import { RootState } from 'redux/reducers_registration';

interface InitProps {
  taskStatusID: string;
}

const TaskStatusUI = (props: InitProps) => {
  const { taskStatusID }: InitProps = props;
  const { filteringTaskByUser, taskStatus, loading }: TaskBoardsType = useSelector((state: RootStateOrAny) => state.taskBoards);
  const { userID }: UserInfoType =  useSelector((state: RootState) => state?.userInfo);
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
      <Droppable droppableId={taskStatus[taskStatusID]?._id} type='TASK_STATUS'>
        {(provided) => (
          <div
            className='task-status'
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
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
              {taskIDs?.map((task, index) => {
                return (
                  <Draggable
                    key={task?._id}
                    draggableId={task?._id}
                    index={index}
                  >
                    {(provideTask) => {
                      return (
                        <div
                          ref={provideTask.innerRef}
                          {...provideTask.draggableProps}
                          {...provideTask.dragHandleProps}
                        >
                          <TasksUI key={task._id} task={task}/>
                        </div>
                      );
                    }}
                  </Draggable>
                );
              })}
              <div className='task-status add-task'>
                <Link className='icon-add-task'><AddIcon/></Link>
                <Typography component='span' className='text-add-task'>NEW TASK</Typography>
              </div>
            </div>
          </div>
        )}
      </Droppable>
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
