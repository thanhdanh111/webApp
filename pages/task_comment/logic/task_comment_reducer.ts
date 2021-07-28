import axios from 'axios'
import { config } from '../../../helpers/get_config'
import { Comment } from 'helpers/type'
import { getTaskComments, setLoading, addTaskComents, deleteTaskComments, updateTaskComments } from './task_comment_action'
import { convertArrayObjectToObject } from 'helpers/convert_array_to_object'
import { taskCommentsActionType } from './task_comment_action_type'
import { pushNewNotifications } from 'redux/common/notifications/reducer'

export interface CommentType {
  comments: { [key: string]: Comment} // key is createdAt
  temporaryComment: string
  loading: boolean
  currentTaskComment : {},
}

export enum NotificationTypes {
  failCreateTag = 'Failed to send comment',
  failDeleteTag = 'Failed to delete comment',
  succeededSaveComment = 'succeeded To Save Comment',
  succeededDeleteComment = 'succeeded To Delete Comment',
}

const initialState: CommentType = {
  comments: {},
  temporaryComment: '',
  loading: false,
  currentTaskComment : {},
}

// tslint:disable-next-line:cyclomatic-complexity
export  const CommentReducer = (state = initialState, action) => {
  switch (action.type) {
    case taskCommentsActionType.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      }
    case taskCommentsActionType.GET_TASK_COMMENTS:
      return {
        ...state,
        comments: action.payload,
      }
    case taskCommentsActionType.ADD_TASK_COMMENT:
      return{
        ...state,
        comments: { ...state.comments, [action.payload?.createdAt]: action.payload },
      }
    case taskCommentsActionType.UPDATE_TASK_COMMENT:
      return {
        ...state,
        comments: { ...state.comments, [action.payload?.createdAt]: action.payload },
      }
    case taskCommentsActionType.DELETE_TASK_COMMENT:
      const createdAtTaskComment   = Object.keys(state.comments).find((key) => state.comments[key]._id === action.payload)
      const comments = { ...state.comments }
      delete comments[`${createdAtTaskComment}`]

      return {
        ...state,
        comments: { ...comments },
      }
    case taskCommentsActionType.SET_TASK_COMMENT:
      return {
        ...state,
      }
    default:
      return state
  }
}

export const getTaskCommentThunkAction = (taskID: string) => async (dispatch) => {
  try {
    await dispatch(setLoading(true))
    const token = localStorage.getItem('access_token')

    if (!token || !taskID) {
      return
    }

    const res = await axios.get(`${config.BASE_URL}/taskcomments`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {
          taskID,
        },
      },
    )

    if (!res) {
      return
    }

    const formatData = convertArrayObjectToObject(res.data?.list, 'createdAt')
    await dispatch(getTaskComments(formatData))
    await dispatch(setLoading(false))
  } catch (error) {
    throw error
  }
}

export const addTaskComentsThunkAction = (content, taskID) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token || !taskID) {
      return
    }

    const res = await axios.post(`${config.BASE_URL}/tasks/${taskID}/comments`,
      {
        content,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
      )
    dispatch(addTaskComents(res.data))
  } catch (error) {
    throw error
  }
}

export const updateTaskCommentThunkAction = (content, taskID , taskCommentID) => async (dispatch) => {
  try {
    await dispatch(setLoading(true))
    const token = localStorage.getItem('access_token')

    if (!token || !taskID) {
      return
    }

    const res = await axios.put(`${config.BASE_URL}/tasks/${taskID}/comments/${taskCommentID}`,
      {
        content,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (res){
      dispatch(updateTaskComments(res.data))
      dispatch(pushNewNotifications({ variant: 'success', message: NotificationTypes.succeededSaveComment }))
    }
  } catch (error) {
    throw error
  }
}

export const deleteTaskCommentThunkAction = (taskID , taskCommentID) => async (dispatch) => {
  try {
    await dispatch(setLoading(true))
    const token = localStorage.getItem('access_token')

    if (!token || !taskID) {
      return
    }

    const res = await axios.delete(`${config.BASE_URL}/tasks/${taskID}/${taskCommentID}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (res){
      dispatch(deleteTaskComments(taskCommentID))
      dispatch(pushNewNotifications({ variant: 'success', message: NotificationTypes.succeededDeleteComment }))
    }
  } catch (error) {
    throw error
  }
}
