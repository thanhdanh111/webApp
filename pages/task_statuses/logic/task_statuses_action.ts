import { taskStatusesActionType } from './task_statuses_action_type';

export const getStatusByID = (status) => {
  return {
    type: taskStatusesActionType.GET_STATUS_BY_ID,
    payload: status,
  };
};

export const setTempTitleStatus = (tempTitleStatus: string) => {
  return {
    type: taskStatusesActionType.SET_TEMP_TITLE_STATUS,
    payload: tempTitleStatus,
  };
};

export const renameStatus = (status) => {
  return {
    type: taskStatusesActionType.RENAME_STATUS,
    payload: status,
  };
};

export const deletedStatus = (statusID) => {
  return {
    type: taskStatusesActionType.DELETE_STATUS,
    payload: statusID,
  };
};

export const createdStatus = (status) => {
  return {
    type: taskStatusesActionType.CREATE_STATUS,
    payload: status,
  };
};

export const setLoading = (loading: boolean) => {
  return {
    type: taskStatusesActionType.SET_LOADING,
    payload: loading,
  };
};

export const setCurrentStatus = (currentStatus) => {
  return {
    type: taskStatusesActionType.SET_CURRENT_STATUS,
    payload: currentStatus,
  };
};
