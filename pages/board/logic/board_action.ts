import { boardsActionType } from './board_type_action';
import { Board, Card } from 'helpers/type';
import { Shape } from '@material-ui/core/styles/shape';

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

interface UpdateCards {
  selectedBoard?: Board;
  selectedCard?: Card;
  shape?: Shape;
  shouldCallApi?: boolean;
  openShare?: boolean;
  needDisplay?: boolean;
  selectionRect?: DOMRect;

}
export const updateCards = (data: UpdateCards) => {
  return {
    data,
    type: boardsActionType.UPDATE_CARDS,
  };
};
