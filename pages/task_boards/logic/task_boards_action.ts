import { SetTasksToTaskStatus } from 'helpers/type';
import { taskBoardsActionType } from './task_board_action_type';

export const setFilterTaskByUserAction = (res: boolean) => {
  return {
    type: taskBoardsActionType.FILTERING_TASK_BY_USER,
    payload: res,
  };
};

export const getTasksStatusByID = (res: object) => {
  return {
    type: taskBoardsActionType.GET_TASK_STATUS_BY_ID,
    payload: res,
  };
};

export const getTaskStatus = (res: object) => {
  return {
    type: taskBoardsActionType.GET_TASK_STATUS,
    payload: res,
  };
};

export const setLoading = (loading: boolean) => {
  return {
    type: taskBoardsActionType.SET_LOADING,
    payload: loading,
  };
};

export const setSelectedTaskBoard = (res: object) => {
  return {
    type: taskBoardsActionType.SET_SELECTED_TASKBOARD,
    payload: {
      currentTaskBoard: res,
    },
  };
};

export const getTaskBoard = (data: object) => {
  return {
    data,
    type: taskBoardsActionType.GET_TASK_BOARD,
  };
};

export const createdTaskBoard = (data: object) => {
  return {
    data,
    type: taskBoardsActionType.CREATE_TASK_BOARD,
  };
};

export const createdTaskStatus = (data: object) => {
  return {
    data,
    type: taskBoardsActionType.CREATE_TASK_STATUS,
  };
};

export const setTasksToTaskStatus = (data: SetTasksToTaskStatus) => {
  return {
    data,
    type: taskBoardsActionType.SET_TASKS_TO_TASK_STATUS,
  };
};
