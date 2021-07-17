import { Tag } from '../../../helpers/type'
import { createTag, deleteTag, getTag, updateTag } from './tag_tasks_action'
import { tagTasksActionType } from './tag_tasks_type_action'
import axios from 'axios'
import { config } from '../../../helpers/get_config'
import { pushNewNotifications } from '../../../redux/common/notifications/reducer'
import { convertArrayObjectToObject } from 'helpers/convert_array_to_object'

export interface TagTaksType {
  tags: {[key: string]: Tag}
}

export enum NotificationTypes {
  failCreateTag = 'Failed to Create Tag',
  failDeleteTag = 'Failed to Delete Tag',
}

const initialState: TagTaksType = {
  tags: {},
}

export  const tagTasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case tagTasksActionType.GET_TAG:
      return {
        ...state,
        tags: action.payload,
      }
    case tagTasksActionType.CREATE_TAG:
      return {
        ...state,
        tags: { ...state.tags, [action.payload?._id]: action.payload },
      }
    case tagTasksActionType.UPDATE_TAG:
      return {
        ...state,
        tags: { ...state.tags, [action.payload._id] : action.payload },
      }
    case tagTasksActionType.DELETE_TAG:
      const tags = { ...state.tags }
      delete tags[action.payload]

      return {
        ...state,
        tags: { ...tags },
      }
    default:
      return state
  }
}

export const getTagsThunkAction = () => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token')
    const companyID = getState()?.userInfo?.currentCompany?._id
    if (!token || !companyID) {
      return
    }
    const res = await axios.get(`${config.BASE_URL}/tags`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {
          companyID,
        },
      })
    dispatch(getTag(convertArrayObjectToObject(res.data.list, '_id')))
  } catch (error) {
    throw error
  }
}

export const createTagThunkAction = (tag) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token')
    const companyID = getState()?.userInfo?.currentCompany?._id
    const departmentID = getState()?.userInfo?.currentDepartment?._id
    if (!token || !companyID) {
      return
    }
    const res = await axios.post(`${config.BASE_URL}/companies/${companyID}/tags`,
      { ...tag, departmentID },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    dispatch(createTag(res.data))

  } catch (error) {
    dispatch(pushNewNotifications({ variant: 'error' , message: NotificationTypes.failCreateTag }))
    throw error
  }
}

export const updateTagThunkAction = (tag) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token')
    const companyID = getState()?.userInfo?.currentCompany?._id
    if (!token || !companyID) {
      return
    }
    const res = await axios.put(`${config.BASE_URL}/companies/${companyID}/tags/${tag._id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    dispatch(updateTag(res.data))
  } catch (error) {
    throw error
  }
}

export const deleteTagThunkAction = (id) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token')
    const companyID = getState()?.userInfo?.currentCompany?._id
    if (!token || !companyID) {
      return
    }
    const res = await axios.delete(`${config.BASE_URL}/companies/${companyID}/tags/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    if (res.data?.isDeleted){
      dispatch(deleteTag(id))
    }
  } catch (error) {
    dispatch(
      pushNewNotifications({
        variant: 'error',
        message:
          error?.response?.data?.message || NotificationTypes.failDeleteTag,
      }),
    )
    throw error
  }
}
