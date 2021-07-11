import { SetTasksToTaskStatus, TaskStatus } from 'helpers/type';
import { taskBoardsActionType } from './task_board_action_type';

export const setFilterTaskByUserAction = (res: boolean) => {
  return {
    type: taskBoardsActionType.FILTERING_TASK_BY_USER,
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

export const addTask = (data) => {
  return {
    type: taskBoardsActionType.ADD_TASK,
    payload: data,
  };
};

export const setTypeCreateTask = (data) => {
  return {
    type: taskBoardsActionType.SET_TYPE_CREATE_TASK,
    payload: data,
  };
};

export const updateNewTask = (newTask) => {
  return {
    type: taskBoardsActionType.UPDATE_NEW_TASK,
    payload: newTask,
  };
};

export const assignUser = (user) => {
  return {
    type: taskBoardsActionType.ASSIGN_USER,
    payload: user,
  };
};

export const unassignUser = (userID) => {
  return {
    type: taskBoardsActionType.UNASSIGN_USER,
    payload: userID,
  };
};

export const setTasksToTaskStatus = (data: SetTasksToTaskStatus) => {
  return {
    data,
    type: taskBoardsActionType.SET_TASKS_TO_TASK_STATUS,
  };
};

export const getTaskDetail = (task) => {
  return {
    type: taskBoardsActionType.GET_TASK_DETAIL,
    payload: task,
  };
};

export const getTag = (tags) => {
  return {
    type: taskBoardsActionType.GET_TAG,
    payload: tags,
  };
};

export const createTag = (tag) => {
  return {
    type: taskBoardsActionType.CREATE_TAG,
    payload: tag,
  };
};

export const updateTag = (tag) => {
  return {
    type: taskBoardsActionType.UPDATE_TAG,
    payload: tag,
  };
};

export const deleteTag = (id) => {
  return {
    type: taskBoardsActionType.DELETE_TAG,
    payload: id,
  };
};

export const updateUserAssigned = (res: object) => {
  return {
    type: taskBoardsActionType.UPDATE_USER_ASSIGN_FOR_TASK,
    payload: res,
  };
};

export const deletedTaskStatus = (taskStatusID) => {
  return {
    type: taskBoardsActionType.DELETE_TASK_STATUS,
    payload: taskStatusID,
  };
};

export const renameTaskStatus = (taskStatus: TaskStatus) => {
  return {
    type: taskBoardsActionType.RENAME_TASK_STATUS,
    payload: taskStatus,
  };
};

export const setTemplateTitleStatus = (templateTitleStatus: string) => {
  return {
    type: taskBoardsActionType.SET_TEMPLATE_TITLE_STATUS,
    payload: templateTitleStatus,
  };
};

// filter task
export const searchTaskByTitle = (tasks) => {
  return {
    type: taskBoardsActionType.SEARCH_TASKS_BY_TITLE,
    payload: tasks,
  };
};

export const setHasNoData = (res: boolean) => {
  return {
    type: taskBoardsActionType.HAS_NO_DATA,
    payload: res,
  };
};

export const setFiltering = (filtering: boolean) => {
  return {
    type: taskBoardsActionType.SET_FILTERING,
    payload: filtering,
  };
};

export const setCrrentFilterLabel = (label) => {
  return {
    type: taskBoardsActionType.SET_CURRENT_FILTER_LABEL,
    payload: label,
  };
};

export const setSelectedTitle = (title) => {
  return {
    type: taskBoardsActionType.SET_SELECT_TITLE,
    payload: title,
  };
};

export const setSelectedTags = (tags) => {
  return {
    type: taskBoardsActionType.SET_SELECT_TAGS,
    payload: tags,
  };
};

export const setSelectedUserIDs = (userIDs) => {
  return {
    type: taskBoardsActionType.SET_SELECT_USERIDS,
    payload: userIDs,
  };
};
