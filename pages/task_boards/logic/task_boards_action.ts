import { Task } from 'helpers/type'
import { taskBoardsActionType } from './task_board_action_type'
export interface SetTasksToTaskStatus {
  taskStatusID: string
  tasks: Task
}

export const setLoading = (loading: boolean) => {
  return {
    type: taskBoardsActionType.SET_LOADING,
    payload: loading,
  }
}

export const setSelectedTaskBoard = (res: object) => {
  return {
    type: taskBoardsActionType.SET_SELECTED_TASKBOARD,
    payload: {
      currentTaskBoard: res,
    },
  }
}

export const getTaskBoard = (data: object) => {
  return {
    data,
    type: taskBoardsActionType.GET_TASK_BOARD,
  }
}

export const createdTaskBoard = (data: object) => {
  return {
    data,
    type: taskBoardsActionType.CREATE_TASK_BOARD,
  }
}

export const renameStatus = (status) => {
  return {
    type: taskBoardsActionType.RENAME_TASK_STATUS,
    payload: status,
  }
}

export const createdStatus = (status) => {
  return {
    type: taskBoardsActionType.CREATE_TASK_STATUS,
    payload: status,
  }
}

export const deletedTaskStatus = (taskStatusID) => {
  return {
    type: taskBoardsActionType.DELETE_TASK_STATUS,
    payload: taskStatusID,
  }
}

export const setTasksToStatus = (data: SetTasksToTaskStatus) => {
  return {
    payload: data,
    type: taskBoardsActionType.SET_TASKS_TO_STATUS,
  }
}

export const removeTasksFfromStatus = (res: { taskID: string, taskStatusID: string }) => {
  return {
    type: taskBoardsActionType.REMOVE_TASK_FROM_STATUS,
    payload: res,
  }
}

export const updateTaskIDsToStatusByID = (data: {statusID: string, taskIDs: string[]}) => {
  return {
    type: taskBoardsActionType.UPDATE_TASKIDS_TO_STATUS,
    payload: data,
  }
}
