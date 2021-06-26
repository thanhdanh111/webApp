import { dashboardClickUp } from './home_type';

export const getDataTaskStatuses = (res: object) => {
  return {
    type: dashboardClickUp.GET_TASK_STATUSES,
    payload: res,
  };
};

export const getDataTasksByUserThunkAction = (res: object) => {
  return {
    type: dashboardClickUp.GET_TASK,
    payload: res,
  };
};

export const getTasksStatusByID = (res: object) => {
  return {
    type: dashboardClickUp.GET_TASK_STATUS_BY_ID,
    payload: res,
  };
};

export const showLoaderListUser = () => {
  return {
    type: dashboardClickUp.SHOW_LOADER_LIST,
  };
};

export const hideLoaderListUser = () => {
  return {
    type: dashboardClickUp.HIDE_LOADER_LIST,
  };
};

export const addTask = (data) => {
  return {
    type: dashboardClickUp.ADD_TASK,
    payload: data,
  };
};

export const setTypeCreateTask = (data) => {
  return {
    type: dashboardClickUp.SET_TYPE_CREATE_TASK,
    payload: data,
  };
};

export const updateNewTask = (newTask) => {
  return {
    type: dashboardClickUp.UPDATE_NEW_TASK,
    payload: newTask,
  };
};

export const assignUser = (user) => {
  return {
    type: dashboardClickUp.ASSIGN_USER,
    payload: user,
  };
};

export const unassignUser = (userID) => {
  return {
    type: dashboardClickUp.UNASSIGN_USER,
    payload: userID,
  };
};
