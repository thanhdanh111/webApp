import { taskStatusesActionType } from './task_statuses_action_type';

export const getStatusByID = (status) => {
  return {
    type: taskStatusesActionType.GET_STATUS_BY_ID,
    payload: status,
  };
};
