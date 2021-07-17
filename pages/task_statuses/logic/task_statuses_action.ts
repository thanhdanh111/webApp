import { taskStatusesActionType } from './task_statuses_action_type'

export const setTempTitleStatus = (tempTitleStatus: string) => {
  return {
    type: taskStatusesActionType.SET_TEMP_TITLE_STATUS,
    payload: tempTitleStatus,
  }
}

export const setLoading = (loading: boolean) => {
  return {
    type: taskStatusesActionType.SET_LOADING,
    payload: loading,
  }
}

export const setCurrentStatus = (currentStatus) => {
  return {
    type: taskStatusesActionType.SET_CURRENT_STATUS,
    payload: currentStatus,
  }
}
