import { taskCommentsActionType } from './task_comment_action_type'

export const setLoading = (loading: boolean) => {
  return {
    type: taskCommentsActionType.SET_LOADING,
    payload: loading,
  }
}

export const getTaskComments = (comments) => {
  return {
    type: taskCommentsActionType.GET_TASK_COMMENTS,
    payload: comments,
  }
}
export const addTaskComents = (comment) => {
  return {
    type: taskCommentsActionType.ADD_TASK_COMMENT,
    payload: comment,
  }
}

export const updateTaskComments = (comment) => {
  return {
    type: taskCommentsActionType.UPDATE_TASK_COMMENT,
    payload: comment,
  }
}

export const deleteTaskComments = (commentID) => {
  return {
    type: taskCommentsActionType.DELETE_TASK_COMMENT,
    payload: commentID,
  }
}

export const setTaskComment = (commentID) => {
  return {
    type: taskCommentsActionType.SET_TASK_COMMENT,
    payload: commentID,
  }
}
