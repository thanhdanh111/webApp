import { Container, Link, Typography } from '@material-ui/core';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import TasksUI from '../../tasks/UI/tasks';
import { useDispatch, useSelector } from 'react-redux';
import { DisappearedLoading } from 'react-loadingg';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import TaskNew from 'pages/tasks/UI/task_new';
import ActionTaskStatusUI from './action_task_status';
import RenameStatusUI from './ui_rename_task_status';
import { getStatusByIDThunkAction, StatusesType } from '../logic/task_statuses_reducer';
import { RootState } from 'redux/reducers_registration';
import { TaskType } from 'pages/tasks/logic/task_reducer';
import { checkHasObjectByKey } from 'helpers/check_in_array';
import { setCurrentStatus } from '../logic/task_statuses_action';

interface InitProps {
  taskStatusID: string;
}

const TaskStatusUI = (props: InitProps) => {
  const { taskStatusID }: InitProps = props;
  // const {
  //   taskStatus,
  //   loading,
  //   currentTaskStatus,
  //   tasks,
  // }: TaskBoardsType = useSelector((state: RootStateOrAny) => state.taskBoards);
  const { statuses, loading, currentStatusID }: StatusesType = useSelector((state: RootState) => state.statuses);
  const { tasks }: TaskType = useSelector((state: RootState) => state.tasks);
  const dispatch = useDispatch();
  const newTaskRef = useRef<HTMLTitleElement>(null);
  const style = statuses && statuses[taskStatusID]?.title?.split(' ').join('-').toLowerCase();
  const [retitling, setRetitling] = useState(false);

  useEffect(() => {
    dispatch(getStatusByIDThunkAction(taskStatusID));
  }, []);

  const contentTask = useMemo(() => {
    return tasks;
  }, [tasks]);

  const setRetitleStatus = () => {
    setRetitling(!retitling);
  };

  const TaskStatusContent = () => {
    const scrollInput = () => {
      if (!newTaskRef.current) {
        return;
      }
      newTaskRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const generateTask = () => {
      for (const each in contentTask) {
        if (!checkHasObjectByKey(contentTask[each], taskStatusID, 'taskStatusID')) {
          continue;
        }

        return (
          <Draggable
            key={each}
            draggableId={each}
          >
            {(provideTask) => {
              return (
                <div
                  ref={provideTask.innerRef}
                  {...provideTask.draggableProps}
                  {...provideTask.dragHandleProps}
                >
                  <TasksUI key={each} task={contentTask[each]}/>
                </div>
              );
            }}
          </Draggable>
        );
      }
    };

    return (
      <>
      <Droppable droppableId={statuses[taskStatusID]?._id} type='TASK_STATUS'>
        {(provided) => (
          <div
            className={`task-status ${style}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <div className='status'>
              <Container className='status-left'>
                  <RenameStatusUI
                    taskStatusID={statuses[taskStatusID]}
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
                    onClick={() => dispatch(setCurrentStatus(statuses[taskStatusID]?._id || ''))}
                  >
                    <AddIcon />
                  </Link>
              </Container>
            </div>
            <div className='status-task-list'>
              {
                currentStatusID === statuses[taskStatusID]?._id &&
                <TaskNew
                  companyID={statuses[taskStatusID]?.companyID?._id || ''}
                  taskStatusID={statuses[taskStatusID]?._id}
                />
              }
              {generateTask()}
              {
                currentStatusID !== statuses[taskStatusID]?._id &&
                  <div
                    className='add-task'
                    onClick={() => {
                      dispatch(setCurrentStatus(statuses[taskStatusID]?._id || ''));
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
      {(!loading) &&
        TaskStatusContent()
      }
      {loading && <DisappearedLoading color={'#67cb48'}/>}
    </div>
  );
};

export default (TaskStatusUI);
