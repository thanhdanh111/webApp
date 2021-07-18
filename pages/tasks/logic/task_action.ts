import { Task } from 'helpers/type'
import { taskActionType } from './task_action_type'

export const getTasks = (tasks: { [key: string]: Task }) => {
  return {
    type: taskActionType.GET_TASKS,
    payload: tasks,
  }
}

export const setLoading = (loading: boolean) => {
  return {
    type: taskActionType.SET_LOADING,
    payload: loading,
  }
}

export const setTempararyTask = (tempTask) => {
  return {
    type: taskActionType.SET_TEMPORARY_TASK,
    payload: tempTask,
  }
}

export const setAssigned = (users) => {
  return {
    type: taskActionType.SET_ASSIGNED,
    payload: users,
  }
}

export const createdTask = (task) => {
  return {
    type: taskActionType.CREATE_TASK,
    payload: task,
  }
}

export const deletedTask = (taskID: string) => {
  return {
    type: taskActionType.DELETE_TASK,
    payload: taskID,
  }
}

export const updateUserAssigned = (res: object) => {
  return {
    type: taskActionType.UPDATE_USER_ASSIGN_FOR_TASK,
    payload: res,
  }
}

export const setSelectedTitle = (title) => {
  return {
    type: taskActionType.SET_SELECTED_TITLE,
    payload: title,
  }
}

export const setSelectedTags = (tags) => {
  return {
    type: taskActionType.SET_SELECTED_TAGS,
    payload: tags,
  }
}

export const setSelectedUserIDs = (userIDs) => {
  return {
    type: taskActionType.SET_SELECTED_USERS,
    payload: userIDs,
  }
}

export const getTaskByID = (task) => {
  return {
    type: taskActionType.GET_TASK_BY_ID,
    payload: task,
  }
}

export const setFilteringTaskByCurrentUser = (data: boolean) => {
  return {
    type: taskActionType.SET_FILLTERING_BY_CURRENT_USER,
    payload: data,
  }
}
