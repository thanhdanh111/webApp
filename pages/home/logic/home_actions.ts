import { SetTasksToTaskStatus, Task, UpdateTaskToTaskStatus } from 'helpers/type';
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

export const setTasksToTaskStatus = (data: SetTasksToTaskStatus) => {
  return {
    data,
    type: dashboardClickUp.SET_TASKS_TO_TASK_STATUS,
  };
};

export const updateTaskToTaskStatus = (data: UpdateTaskToTaskStatus) => {
  return {
    data,
    type: dashboardClickUp.UPDATE_TASKS_TO_TASK_STATUS,
  };
};

export const setSelectedTask = (task: Task) => {
  return {
    type: dashboardClickUp.SET_SELECTED_TASK,
    data: task,
  };
};
