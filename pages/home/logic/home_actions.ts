import { dashboardClickUp } from './home_type';

export const getDataTasksByUserThunkAction = (res: object) => {
  return {
    type: dashboardClickUp.GET_TASK_BY_USER_ID,
    payload: res,
  };
};

export const getTasksStatusByID = (res: object) => {
  return {
    type: dashboardClickUp.GET_TASK_STATUS_BY_ID,
    payload: res,
  };
};

export const setLoading = (loading: boolean) => {
  return {
    type: dashboardClickUp.SET_LOADING,
    payload: loading,
  };
};

export const setSelectedTaskBoard = (res: string) => {
  return {
    type: dashboardClickUp.SET_SELECTED_TASKBOARD,
    payload: {
      selectTaskBoardID: res,
    },
  };
};

export const getTaskBoard = (data: object) => {
  return {
    data,
    type: dashboardClickUp.GET_TASK_BOARD,
  };
};

export const getTaskBoardByID = (data: object) => {
  return {
    data,
    type: dashboardClickUp.GET_TASK_BOARD_BY_ID,
  };
};

export const createdTaskBoard = (data: object) => {
  return {
    data,
    type: dashboardClickUp.CREATE_TASK_BOARD,
  };
};
