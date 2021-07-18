import { boardsActionType } from './board_type_action'

export const getBoardAction = (res: object) => {
  return {
    type: boardsActionType.GET_LIST_BOARDS,
    payload: res,
  }
}

export const setBoard = (res: object) => {
  return {
    type: boardsActionType.SET_BOARD,
    payload: res,
  }
}

export const updateNameFlowChartAction = (res: object) => {
  return {
    type: boardsActionType.UPDATE_NAME_FLOWCHART,
    payload: res,
  }
}

export const createBoardAction = (res: object) => {
  return {
    type: boardsActionType.CREATE_BOARD,
    payload: res,
  }
}

export const deleteBoardAction = (id) => {
  return {
    type: boardsActionType.DELETE_BOARD,
    payload: id,
  }
}

export const showLoaderListEventLogs = () => {
  return {
    type: boardsActionType.SHOW_LOADER_LIST,
  }
}

export const hideLoaderListEventLogs = () => {
  return {
    type: boardsActionType.HIDE_LOADER_LIST,
  }
}

export const hasNoBoards = () => {
  return {
    type: boardsActionType.HAS_NO_DATA,
  }
}

export const setSelectedBoard = (res) => {
  return {
    type: boardsActionType.SET_SELECTED_BOARD,
    payload: {
      selectedBoard: res,
    },
  }
}
