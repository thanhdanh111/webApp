import { Tag } from 'helpers/type'
import { tagTasksActionType } from './tag_tasks_type_action'

export const getTag = (data : { tags: { [key: string]: Tag}, cursor: string, totalCount: number }) => {
  return {
    type: tagTasksActionType.GET_TAG,
    payload: data,
  }
}

export const createTag = (tag) => {
  return {
    type: tagTasksActionType.CREATE_TAG,
    payload: tag,
  }
}

export const updateTag = (tag) => {
  return {
    type: tagTasksActionType.UPDATE_TAG,
    payload: tag,
  }
}

export const deleteTag = (id) => {
  return {
    type: tagTasksActionType.DELETE_TAG,
    payload: id,
  }
}
