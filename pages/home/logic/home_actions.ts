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
