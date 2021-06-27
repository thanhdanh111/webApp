import { UpdateOnConfirmDialog } from './time_off_interface';

export enum TimeOffActionTypes {
  UpdatePaginationTimeOff = 'UpdatePaginationTimeOff',
  UpdateOptionState = 'UpdateOptionState',
  UpdateTimeOffLoadingStatus = 'UpdateTimeOffLoadingStatus',
  UpdateStatusTimeOff = 'UpdateStatusTimeOff',
  UpdateTimeOffIndexLoading = 'UpdateTimeOffIndexLoading',
  UpdateOnConfirmDialog = 'UpdateOnConfirmDialog',
  UpdateOnSelectTimeOff = 'UpdateOnSelectTimeOff',
  UpdateTimeOffsReducer = 'UpdateTimeOffsReducer',
  getTimeOffByID = 'getTimeOffByID',
}

export enum TimeOffRequestActionTypes {
  UpdateTimeOffCompaniesToRequest = 'UpdateTimeOffCompaniesToRequest',
  UpdateContentLetter = 'UpdateContentLetter',
  UpdateOnSendingTimeOffRequest = 'UpdateOnSendingTimeOffRequest',
  UpdateTimeOffRequestNotifications = 'UpdateTimeOffRequestNotifications',
  UpdateTimeOffRequestReducer = 'UpdateTimeOffRequestReducer',
  getTimeOffByID = 'getTimeOffByID',
}

export const updatePaginationTimeOff = ({ pagination, loadingStatus }) => {
  return {
    pagination,
    loadingStatus,
    type: TimeOffActionTypes.UpdatePaginationTimeOff,
  };
};

export const updateOptionState = ({ optionState }) => {
  return {
    optionState,
    type: TimeOffActionTypes.UpdateOptionState,
  };
};

export const updateTimeOffLoadingStatus = ({ loadingStatus }) => {
  return {
    loadingStatus,
    type: TimeOffActionTypes.UpdateTimeOffLoadingStatus,
  };
};

export const updateStatusTimeOff = ({ timeOffIndex, fieldName, status }) => {
  return {
    fieldName,
    timeOffIndex,
    status,
    type: TimeOffActionTypes.UpdateStatusTimeOff,
  };
};

export const updateTimeOffIndexLoading = ({ isLoading, loadingIndex, loadingOptionName }) => {
  return {
    isLoading,
    loadingIndex,
    loadingOptionName,
    type: TimeOffActionTypes.UpdateTimeOffIndexLoading,
  };
};

export const updateOnConfirmDialog = ({ onConfirm }: UpdateOnConfirmDialog) => {
  return {
    onConfirm,
    type: TimeOffActionTypes.UpdateOnConfirmDialog,
  };
};

export const updateOnSelectTimeOff = ({ onConfirm, onSelectTimeOffData }: UpdateOnConfirmDialog) => {
  return {
    onConfirm,
    onSelectTimeOffData,
    type: TimeOffActionTypes.UpdateOnSelectTimeOff,
  };
};

export const updateTimeOffCompaniesToRequest = ({ companies }) => {
  return {
    companies,
    type: TimeOffRequestActionTypes.UpdateTimeOffCompaniesToRequest,
  };
};

export const updateContentLetter = ({ selectedContent }) => {
  return {
    data: selectedContent,
    type: TimeOffRequestActionTypes.UpdateContentLetter,
  };
};

export const updateOnSendingTimeOffRequest = ({ onSendingRequest }) => {
  return {
    onSendingRequest,
    type: TimeOffRequestActionTypes.UpdateOnSendingTimeOffRequest,
  };
};

export const updateTimeOffRequestNotifications = ({ notifications, onSendingRequest }) => {
  return {
    notifications,
    onSendingRequest,
    type: TimeOffRequestActionTypes.UpdateTimeOffRequestNotifications,
  };
};

export const updateTimeOffsReducer = (data) => {
  return {
    data,
    type: TimeOffActionTypes.UpdateTimeOffsReducer,
  };
};

export const updateTimeOffRequestReducer = (data) => {

  return {
    data,
    type: TimeOffRequestActionTypes.UpdateTimeOffRequestReducer,
  };
};

export const getTimeOffByID = (data) => {

  return {
    data,
    type: TimeOffRequestActionTypes.getTimeOffByID,
  };
};
