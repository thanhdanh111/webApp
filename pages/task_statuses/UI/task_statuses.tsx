import { Container, Link, Typography } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import TasksUI from '../../tasks/UI/tasks';
import { RootStateOrAny,  useDispatch,  useSelector } from 'react-redux';
import {  getTaskStatusThunkAction, TaskBoardsType } from 'pages/task_boards/logic/task_boards_reducer';
import { DisappearedLoading } from 'react-loadingg';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { UserInfoType } from 'helpers/type';
import { RootState } from 'redux/reducers_registration';
import TaskNew from 'pages/tasks/UI/task_new';
import { setTypeCreateTask } from 'pages/task_boards/logic/task_boards_action';
import ActionTaskStatusUI from './action_task_status';
import RenameStatusUI from './ui_rename_task_status';

interface InitProps {
  taskStatusID: string;
}

const TaskStatusUI = (props: InitProps) => {
  const { taskStatusID }: InitProps = props;
  const {
    filteringTaskByUser,
    taskStatus,
    loading,
    currentTaskStatus,
  }: TaskBoardsType = useSelector((state: RootStateOrAny) => state.taskBoards);
  const { userID }: UserInfoType =  useSelector((state: RootState) => state?.userInfo);
  const dispatch = useDispatch();
  const newTaskRef = useRef<HTMLTitleElement>(null);
  const style = taskStatus && taskStatus[taskStatusID]?.title?.split(' ').join('-').toLowerCase();
  const [retitling, setRetitling] = useState(false);

  useEffect(() => {
    dispatch(getTaskStatusThunkAction(taskStatusID));
  }, []);

  const setRetitleStatus = () => {
    setRetitling(!retitling);
  };

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

    const scrollInput = () => {
      if (!newTaskRef.current) {
        return;
      }
      newTaskRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

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
                  <RenameStatusUI
                    taskStatusID={taskStatus[taskStatusID]}
                    renaming={retitling}
                    setRetitleStatus={setRetitleStatus}
                  />
              </Container>
              <Container className='status-right'>
                  <ActionTaskStatusUI
                    taskStatusID={taskStatusID}
                    setRenameStatus={setRetitleStatus}
                  />
                  <Link
                    className='actions-status add-action'
                    onClick={() => dispatch(setTypeCreateTask(taskStatus[taskStatusID]?._id || ''))}
                  >
                    <AddIcon />
                  </Link>
              </Container>
            </div>
            <div className='status-task-list'>
              {
                currentTaskStatus === taskStatus[taskStatusID]?._id &&
                <TaskNew
                  companyID={taskStatus[taskStatusID]?.companyID?._id || ''}
                  taskStatusID={taskStatus[taskStatusID]?._id}
                />
              }
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
              {
                currentTaskStatus !== taskStatus[taskStatusID]?._id &&
                  <div
                    className='add-task'
                    onClick={() => {
                      dispatch(setTypeCreateTask(taskStatus[taskStatusID]?._id || ''));
                      scrollInput();
                    }}
                  >
                  <Link className='icon-add-task'><AddIcon /></Link>
                  <Typography component='span' className='text-add-task'>NEW TASK</Typography>
                  </div>
                }
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
