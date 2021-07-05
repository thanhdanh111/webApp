import { boardsActionType } from './board_type_action';

export const getBoardAction = (res: object) => {
  return {
    type: boardsActionType.GET_LIST_BOARDS,
    payload: res,
  };
};

export const setBoard = (res: object) => {
  return {
    type: boardsActionType.SET_BOARD,
    payload: res,
  };
};

export const updateNameFlowChartAction = (res: object) => {
  return {
    type: boardsActionType.UPDATE_NAME_FLOWCHART,
    payload: res,
  };
};

export const createBoardAction = (res: object) => {
  return {
    type: boardsActionType.CREATE_BOARD,
    payload: res,
  };
};

export const deleteBoardAction = (id: string) => {
  return {
    type: boardsActionType.DELETE_BOARD,
    payload: id,
  };
};

export const createCardAction = (res: object) => {
  return {
    type: boardsActionType.CREATE_CARD,
    payload: res,
  };
};

export const getDataListCardAction = (res: object) => {
  return {
    type: boardsActionType.GET_DATA_LIST_CARD,
    payload: res,
  };
};
export const updateCards = (res: object) => {
  return {
    type: boardsActionType.UPDATE_CARDS,
    payload: res,
  };
};
