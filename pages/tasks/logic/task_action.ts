import { Task } from 'helpers/type';
import { taskActionType } from './task_action_type';

export const getTaskByID = (tasks: { [key: string]: Task }) => {
  return {
    type: taskActionType.GET_TASKS,
    payload: tasks,
  };
};

export const setLoading = (loading: boolean) => {
  return {
    type: taskActionType.SET_LOADING,
    payload: loading,
  };
};

export const setTempararyTask = (tempTask) => {
  return {
    type: taskActionType.SET_TEMPORARY_TASK,
    payload: tempTask,
  };
};

export const setAssigned = (users) => {
  return {
    type: taskActionType.SET_ASSIGNED,
    payload: users,
  };
};

export const createdTask = (task) => {
  return {
    type: taskActionType.CREATE_TASK,
    payload: task,
  };
};
