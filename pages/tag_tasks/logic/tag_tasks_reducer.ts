import { Tag, Task } from '../../../helpers/type'
import { createTag, deleteTag, getTag, updateTag } from './tag_tasks_action'
import { tagTasksActionType } from './tag_tasks_type_action'
import axios from 'axios'
import { config } from '../../../helpers/get_config'
import { pushNewNotifications } from '../../../redux/common/notifications/reducer'
import { convertArrayObjectToObject } from 'helpers/convert_array_to_object'
import { getTaskByID, getTasks } from 'pages/tasks/logic/task_action'

export interface TagTaksType {
  tags: {[key: string]: Tag}
  cursor: string
  totalCount: number
}

export enum NotificationTypes {
  failCreateTag = 'Failed to Create Tag',
  failDeleteTag = 'Failed to Delete Tag',
}

const initialState: TagTaksType = {
  tags: {},
  cursor: '',
  totalCount: 0,
}

export  const tagTasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case tagTasksActionType.GET_TAG:
      return {
        ...state,
        tags: action.payload.tags,
        cursor: action.payload.cursor,
        totalCount: action.payload.totalCount,
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
export const getTagsThunkAction = (searchTag, isNewSearchTag) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token')
    const companyID = getState()?.userInfo?.currentCompany?._id
    if (!token || !companyID) {
      return
    }
    let cursor = ''
    let listTags = {}

    if (!isNewSearchTag) {
      cursor = getState()?.tagTasks.cursor
      if (cursor === 'END'){
        return
      }
      listTags = getState()?.tagTasks.tags
    }

    const res = await axios.get(`${config.BASE_URL}/tags`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {
          cursor,
          companyID,
          limit: 10,
          name: searchTag,
          sortDirection: 'ASC',
          sortBy: 'name',
        },
      })
    const dataConvert = convertArrayObjectToObject(res.data.list, '_id')
    dispatch(getTag({ tags: { ...listTags, ...dataConvert }, cursor: res.data.cursor, totalCount : res.data.totalCount }))
  } catch (error) {
    throw error
  }
}

export const createTagThunkAction = (tag) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token')
    const companyID = getState()?.userInfo?.currentCompany?._id

    if (!token || !companyID) {
      return
    }
    const res = await axios.post(`${config.BASE_URL}/companies/${companyID}/tags`,
      { ...tag },
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

export const updateTagThunkAction = (tagID, dataUpdateTag) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token')
    const companyID = getState()?.userInfo?.currentCompany?._id
    const { tasks, currentTask }: {tasks: {[key: string] : Task}, currentTask: Task} = getState()?.tasks

    if (!token || !companyID) {
      return
    }
    const res = await axios.put(`${config.BASE_URL}/companies/${companyID}/tags/${tagID}`,
    dataUpdateTag,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    dispatch(updateTag(res.data))
    currentTask.tagIDs = updateTagInTags(currentTask?.tagIDs || [], res.data)
    dispatch(getTaskByID(currentTask))
    Object.keys(tasks).map((key) => {
      tasks[key].tagIDs = updateTagInTags(tasks[key]?.tagIDs || [], res.data)
    })
    dispatch(getTasks(tasks))
  } catch (error) {
    throw error
  }
}

export const deleteTagThunkAction = (id) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token')
    const companyID = getState()?.userInfo?.currentCompany?._id
    const { tasks, currentTask }: {tasks: {[key: string] : Task}, currentTask: Task} = getState()?.tasks

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
      currentTask.tagIDs = currentTask?.tagIDs?.filter((tag) => tag._id !== id)
      dispatch(getTaskByID(currentTask))
      Object.keys(tasks).map((key) => {
        tasks[key].tagIDs = tasks[key]?.tagIDs?.filter((tag) => tag._id !== id)
      })
      dispatch(getTasks(tasks))

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

const updateTagInTags = (tags: Tag[], tagUpdate: Tag) => {
  return tags.map((tag) => tag._id === tagUpdate._id ? tagUpdate : tag)
}
