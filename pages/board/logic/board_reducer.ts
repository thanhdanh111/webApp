import axios from 'axios';
import { config } from 'helpers/get_config';
import { BoardsPage, Card } from 'helpers/type';
import { pushNewNotifications } from 'redux/common/notifications/reducer';
import { createBoardAction, getBoardAction, setBoard, updateNameFlowChartAction, deleteBoardAction, updateCards } from './board_action';
import { boardsActionType } from './board_type_action';

export enum NotificationTypes {
  succeedCreateFlowChart = 'Create FlowChart Successfully',
  succeedUpdateNameFlowChart = 'Succeed Update Name FlowChart',
  failedCreateFlowChart = 'Failed Create FlowChart',
  errorFailed = 'Error data. Please update slack token!',
  companyTokenNotification = 'You have not registered any companies for workspace',
  succeedDeleteBoard = 'Delete FlowChart Successfully',
  failedDeleteBoard = 'Failed Delete FlowChart',
}
export enum Shape {
  PROCESS = 'PROCESS',
  DECISION = 'DECISION',
}
const initialState: BoardsPage = {
  boards: [],
  selectedBoard: {
    _id: '',
    name: '',
    companyID: '',
    projectID: '',
  },
  cards: [],
  selectedCard: {
    _id: '',
    boardID: '',
    companyID: '',
    textContent: '',
    shape: Shape.PROCESS,
  },
};
// const initialState: Card = {
//   selectionReact: undefined,
//   textContent: '',
//   shape: '',
//   selectedBoard: {},
//   selectedCard: {},
//   shouldCallApi: true,
//   openShare: false,
//   needDisplay: false,

// };

export type CardsValueType = Card;

export const boardsReducer = (state = initialState, action) => {
  switch (action.type) {
    case boardsActionType.GET_LIST_BOARDS:
      return {
        ...state,
        boards: action.payload.list,
      };

    case boardsActionType.SET_BOARD:
      return {
        ...state,
        selectedBoard: action.payload,
      };

    case boardsActionType.UPDATE_NAME_FLOWCHART:
      return {
        ...state,
        selectedBoard: action.payload,
      };

    case boardsActionType.CREATE_BOARD:
      return {
        ...state,
        selectedBoard: action.payload,
      };

    case boardsActionType.DELETE_BOARD:
      const resolveBoard = state.boards.filter((board) => board._id !== action.payload);

      return {
        ...state,
        boards: resolveBoard,
      };

    default:
      return state;
  }
};

export const getBoardDataMiddleWare = () => async (dispatch, getState) => {

  try {
    const token = localStorage.getItem('access_token');
    const userInfo = getState()?.userInfo;
    const companyID = userInfo?.currentCompany?._id;

    const res = await axios.get(`${config.BASE_URL}/boards`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      params: {
        companyID,
      },
    });

    await dispatch(getBoardAction(res.data));

  } catch (error) {
    throw error;
  }
};

export const getBoardDetailDataMiddleWare = (detailsBoardID) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');

    if (!detailsBoardID) {
      return;
    }

    const res = await axios.get(`${config.BASE_URL}/boards/${detailsBoardID}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    await dispatch(setBoard(res.data));
  } catch (error) {
    throw error;
  }
};

export const createFlowChartMiddleWare = (router, currentPath) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token');
    const userInfo = getState()?.userInfo;
    const companyID = userInfo?.currentCompany?._id;

    const nameNewBoardDefault = 'untitled';

    if (!token || !companyID) {

      dispatch(pushNewNotifications({ variant: 'error' , message: NotificationTypes.companyTokenNotification }));

      return ;
    }

    const res = await axios.post(`${config.BASE_URL}/boards`,
      {
        companyID,
        name: nameNewBoardDefault,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    dispatch(createBoardAction(res.data));

    router.push(`${currentPath}/${res.data?._id}`);
  } catch (error) {
    dispatch(pushNewNotifications({ variant: 'error', message: NotificationTypes.failedCreateFlowChart }));
  }
};

export const updateNameFlowChartMiddleWare = (boardID: string, name: string) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token');
    const userInfo = getState()?.userInfo;
    const companyID = userInfo?.currentCompany?._id;

    if (!companyID || !name || !boardID) {

      dispatch(pushNewNotifications({ variant: 'error' , message: NotificationTypes.companyTokenNotification }));

      return ;
    }
    const res = await axios.put(`${config.BASE_URL}/boards/${boardID}`,
      {
        boardID,
        name,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.data) {
      dispatch(updateNameFlowChartAction);
      dispatch(pushNewNotifications({ variant: 'success' , message: NotificationTypes.succeedUpdateNameFlowChart }));
    }

  } catch (error) {
    throw error;
  }
};

export const deleteBoardMiddleWare = (boardID: string) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token');
    const userInfo = getState()?.userInfo;
    const companyID = userInfo?.currentCompany?._id;

    if (!token || !companyID || !boardID) {

      dispatch(pushNewNotifications({ variant: 'error' , message: NotificationTypes.companyTokenNotification }));

      return ;
    }

    const res = await axios.delete(`${config.BASE_URL}/boards/${boardID}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (res.data) {
      dispatch(deleteBoardAction(boardID));
      dispatch(pushNewNotifications({ variant: 'success', message: NotificationTypes.succeedDeleteBoard }));
    }
  } catch (error) {
    dispatch(pushNewNotifications({ variant: 'error', message: NotificationTypes.failedDeleteBoard }));
  }
};

export const createNewCard = () => async (dispatch, getState) => {

  try {
    const token = localStorage.getItem('access_token');
    const  {
      textContent,
      shape,
      selectedBoard,
      selectedCard,
    }: boardsValueType = getState()?.cards;
    const companyID = selectedBoard?.companyID?._id ?? selectedBoard?.companyID;
    const boardID = selectedBoard?._id;

    if (!companyID || !boardID || !shape || !selectedCard._id) {

      dispatch(pushNewNotifications({ variant: 'error' , message: NotificationTypes.companyTokenNotification }));

      return ;
    }

    dispatch(updateCards());

    const rawBlocks = convertToRaw(editorState?.getCurrentContent());
    const res = await axios.post(`${config.BASE_URL}/boards/${boardID}/cards`,
      {
        textContent,
        shape,
        companyID,
        leftTo: rawBlocks?.blocks,
        rightTo: rawBlocks.blocks,
        bottomTo: rawBlocks.blocks,
        topTo: rawBlocks.blocks,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const newBoardsMap = boardsMap;

    newBoardsMap?.[boardID].cards?.push({
      textContent: res?.data.textContent,
      shape: res?.data?.shape,
      _id: res?.data?._id,
      leftTo: res?.data?.leftTo,
      rightTo: res?.data?.rightTo,
      bottomTo: res?.data?.bottomTo,
      topTo: res?.data?.topTo,
    });

    dispatch(updateCards({ loading: false, boardsMap: newBoardsMap }));
  } catch (error) {
    dispatch(updateCards({ loading: false }));
  }
};
