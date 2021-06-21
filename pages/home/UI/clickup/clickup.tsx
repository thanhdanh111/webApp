import { getTaskStatusThunkAction, getTasksByUserThunkAction, updateTaskStatusById, updateTaskById } from 'pages/home/logic/home_reducer';
import React, { FunctionComponent, useEffect } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { DisappearedLoading } from 'react-loadingg';
import { checkArray } from 'helpers/check_array';
import TaskStatus from './statuses_clickup';
import NavClickUp from './nav_clickup';
import { Task, TaskStatusType } from 'helpers/type';
import { Typography } from '@material-ui/core';
import { DragDropContext } from 'react-beautiful-dnd';
interface IDroppable {
  droppableId: string;
  index: number;
}

interface OnDropResult {
  destination: IDroppable;
  source: IDroppable;
}

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const resultMove = {};
  resultMove[droppableSource.droppableId] = sourceClone;
  resultMove[droppableDestination.droppableId] = destClone;

  return resultMove;
};

const BoardTasks: FunctionComponent = () => {
  const dispatch = useDispatch();
  const taskStatuses = useSelector((state: RootStateOrAny) => state.taskStatuses);
  const authState = useSelector((state: RootStateOrAny) => state.auth);
  const loading = taskStatuses.loading;
  const companyID = authState?.extendedCompany?.companyID?._id;
  const departmentID = authState?.department?._id;

  useEffect(() => {
    void fetchData();
  }, []);

  const fetchData = () => {
    dispatch(getTaskStatusThunkAction());
    dispatch(getTasksByUserThunkAction());
  };

  const GenerateTaskStatuses = () => {
    return checkArray(taskStatuses.list) && taskStatuses.list.map((taskStatus: JSX.IntrinsicAttributes & TaskStatusType) => {
      return (
        <>
          <TaskStatus
            key={taskStatus._id}
            taskStatus={taskStatus}
            user={authState}
            companyID={companyID}
            departmentID={departmentID}
            listTasks={taskStatuses.listTasks}
          />
        </>
      );
    });
  };

  const getTasksFromTaskStatus = ({ taskStatusId }) => {
    for (const taskStatus of taskStatuses.list) {
      if (!taskStatus || taskStatus._id !== taskStatusId) {
        continue;
      }

      return taskStatus.taskIDs;
    }
  };

  const onDragEnd = (result) => {
    const { source, destination }: OnDropResult = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items: Task[] = reorder(
        getTasksFromTaskStatus({ taskStatusId: source.droppableId }),
        source.index,
        destination.index,
      ) as Task[];

      dispatch(updateTaskStatusById({
        taskStatusID: source.droppableId,
        tasks: items,
      }));

      return;
    }

    const sourceTasks = getTasksFromTaskStatus({ taskStatusId: source.droppableId }) || [];
    let destinationTasks = getTasksFromTaskStatus({ taskStatusId: destination.droppableId });

    const movedData = move(
      sourceTasks,
      destinationTasks,
      source,
      destination,
    );

    const newSourceTasks = movedData[source.droppableId] as Task[];
    destinationTasks = movedData[destination.droppableId] as Task[];

    dispatch(updateTaskById({
      destinationTasks,
      taskID: sourceTasks[source.index]?._id,
      data: { taskStatusID: destination.droppableId },
      sourceTasks: newSourceTasks,
      sourceTaskStatusID: source.droppableId,
    }));
  };

  return (
    <div className='board'>
      <NavClickUp/>
      <div className='board-tasks'>
          {!loading &&
          <>
            <DragDropContext onDragEnd={onDragEnd}>
              {GenerateTaskStatuses()}
            </DragDropContext>
            <div className='add-task task-status'>
                <Typography component='span' className='add-task-text'>NEW TASK</Typography>
              </div>
          </>}
            {loading && <DisappearedLoading color={'#67cb48'}/>}
        </div>
      </div>
  );
};

export default (BoardTasks);
