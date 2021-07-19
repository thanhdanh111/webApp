import { eventLogsAction } from './event_log_type_action'

export const getEventLogs = (res: object) => {
  return {
    type: eventLogsAction.GET_EVENT_LOGS,
    payload: res,
  }
}

export const getEventLog = (res: object) => {
  return {
    type: eventLogsAction.GET_EVENT_LOG,
    payload: res,
  }
}

export const eventLogCursor = (res: string) => {
  return {
    type: eventLogsAction.EVENT_LOG_CURSOR,
    payload: res,
  }
}

export const showLoaderListEventLogs = () => {
  return {
    type: eventLogsAction.SHOW_LOADER_LIST,
  }
}

export const hideLoaderListEventLogs = () => {
  return {
    type: eventLogsAction.HIDE_LOADER_LIST,
  }
}

export const setSelectedTime = (res: number) => {
  return {
    type: eventLogsAction.SET_SELECTED_TIME,
    payload: {
      selectedTime: res,
    },
  }
}

export const setSelectedEnv = (res: string) => {
  return {
    type: eventLogsAction.SET_SELECTED_ENV,
    payload: {
      selectedEnv: res,
    },
  }
}

export const setSelectedProjectID = (res: string) => {
  return {
    type: eventLogsAction.SET_SELECTED_PROJECTID,
    payload: {
      selectedProjectID: res,
    },
  }
}

export const showLoader = () => {
  return {
    type: eventLogsAction.SHOW_LOADER_LIST,
  }
}

export const hideLoader = () => {
  return {
    type: eventLogsAction.HIDE_LOADER_LIST,
  }
}

export const hasNoEventLogs = () => {
  return {
    type: eventLogsAction.HAS_NO_DATA,
  }
}
