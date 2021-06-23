import { dashboardClickUp } from './home_type';

export const setFilterTaskByUserAction = (res: boolean) => {
  return {
    type: dashboardClickUp.FILTERING_TASK_BY_USER,
    payload: res,
  };
};

export const getTasksStatusByID = (res: object) => {
  return {
    type: dashboardClickUp.GET_TASK_STATUS_BY_ID,
    payload: res,
  };
};

export const getTaskStatuses = (res: object) => {
  return {
    type: dashboardClickUp.GET_TASK_STATUSES,
    payload: res,
  };
};

export const setLoading = (loading: boolean) => {
  return {
    type: dashboardClickUp.SET_LOADING,
    payload: loading,
  };
};

export const setSelectedTaskBoard = (res: object) => {
  return {
    type: dashboardClickUp.SET_SELECTED_TASKBOARD,
    payload: {
      currentTaskBoard: res,
    },
  };
};

export const getTaskBoard = (data: object) => {
  return {
    data,
    type: dashboardClickUp.GET_TASK_BOARD,
  };
};

export const createdTaskBoard = (data: object) => {
  return {
    data,
    type: dashboardClickUp.CREATE_TASK_BOARD,
  };
};
