import axios from 'axios'
import { config } from 'helpers/get_config'
import { BoardsPage } from 'helpers/type'
import { pushNewNotifications } from 'redux/common/notifications/reducer'
import {
  createBoardAction,
  getBoardAction,
  setBoard,
  updateNameFlowChartAction,
  deleteBoardAction,
  hasNoBoards,
} from './board_action'
import { boardsActionType } from './board_type_action'
import { hideLoader } from 'pages/event_logs/logic/event_log_action'

export enum NotificationTypes {
  succeedCreateFlowChart = 'Create FlowChart Successfully',
  succeedUpdateNameFlowChart = 'Succeed Update Name FlowChart',
  failedUpdateNameFlowChart = 'Failed Update Name FlowChart',
  failedCreateFlowChart = 'Failed Create FlowChart',
  errorFailed = 'Error data. Please update slack token!',
  companyTokenNotification = 'You have not registered any companies for workspace',
  succeedDeleteBoard = 'Delete FlowChart Successfully',
  failedDeleteBoard = 'Failed to Delete FlowChart',
}
export const Shape = {
  PROCESS: 'PROCESS',
  DECISION: 'DECISION',
}

const initialState: BoardsPage = {
  boards: [],
  selectedBoard: {
    _id: '',
    name: '',
    companyID: '',
    projectID: '',
  },
  loading: true,
  hasNoBoards: false,
}

// tslint:disable-next-line: cyclomatic-complexity
export const boardsReducer = (state = initialState, action) => {
  switch (action.type) {
    case boardsActionType.GET_LIST_BOARDS:
      return {
        ...state,
        boards: action.payload.list,
      }

    case boardsActionType.SET_BOARD:
      return {
        ...state,
        selectedBoard: action.payload,
      }

    case boardsActionType.UPDATE_NAME_FLOWCHART:
      return {
        ...state,
        selectedBoard: action.payload,
      }

    case boardsActionType.CREATE_BOARD:
      return {
        ...state,
        selectedBoard: action.payload,
      }

    case boardsActionType.DELETE_BOARD:
      const resolveBoard = state.boards.filter((board) => board?._id !== action.payload)

      return {
        ...state,
        boards: resolveBoard,
      }

    case boardsActionType.SHOW_LOADER_LIST:
      return {
        ...state,
        loading: true,
      }
    case boardsActionType.HIDE_LOADER_LIST:
      return {
        ...state,
        loading: false,
      }

    case boardsActionType.HAS_NO_DATA:
      return {
        ...state,
        hasNoBoards: true,
      }

    case boardsActionType.SET_SELECTED_BOARD:
      return {
        ...state,
        selectedBoard: {},
      }

    default:
      return state
  }
}

export const getBoardDataMiddleWare = () => async (dispatch, getState) => {

  try {
    const token = localStorage.getItem('access_token')
    const userInfo = getState()?.userInfo
    const companyID = userInfo?.currentCompany?._id

    const res = await axios.get(`${config.BASE_URL}/boards`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      params: {
        companyID,
      },
    })

    if (!res?.data?.totalCount) {
      await dispatch(hasNoBoards())
      await dispatch(hideLoader())
    }

    await dispatch(getBoardAction(res.data))
    await dispatch(hideLoader())

  } catch (error) {
    throw error
  }
}

export const getBoardDetailDataMiddleWare = (detailsBoardID) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token')

    if (!detailsBoardID) {
      return
    }

    const res = await axios.get(`${config.BASE_URL}/boards/${detailsBoardID}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    await dispatch(setBoard(res.data))
  } catch (error) {
    throw error
  }
}

export const createFlowChartMiddleWare = (router, currentPath) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token')
    const userInfo = getState()?.userInfo
    const companyID = userInfo?.currentCompany?._id

    const nameNewBoardDefault = 'untitled'

    if (!token || !companyID) {

      dispatch(pushNewNotifications({ variant: 'error' , message: NotificationTypes.companyTokenNotification }))

      return
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
    )

    dispatch(createBoardAction(res.data))

    router.push({ pathname: `${currentPath}/view`, query: { id: res.data?._id } })
    dispatch(pushNewNotifications({ variant: 'success', message: 'Create FlowChart successfully' }))
  } catch (error) {
    dispatch(pushNewNotifications({ variant: 'error', message: NotificationTypes.failedCreateFlowChart }))
  }
}

export const updateNameFlowChartMiddleWare = (boardID: string, name: string) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token')
    const userInfo = getState()?.userInfo
    const companyID = userInfo?.currentCompany?._id

    if (!companyID || !name || !boardID) {

      dispatch(pushNewNotifications({ variant: 'error' , message: NotificationTypes.companyTokenNotification }))

      return
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
    )

    if (res.data) {
      dispatch(updateNameFlowChartAction)
      dispatch(pushNewNotifications({ variant: 'success' , message: NotificationTypes.succeedUpdateNameFlowChart }))
    }

  } catch (error) {
    dispatch(pushNewNotifications({ variant: 'error' , message: NotificationTypes.failedUpdateNameFlowChart }))
  }
}

export const deleteBoardMiddleWare = (boardID: string) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token')
    const userInfo = getState()?.userInfo
    const companyID = userInfo?.currentCompany?._id

    if (!token || !companyID || !boardID) {

      dispatch(pushNewNotifications({ variant: 'error' , message: NotificationTypes.companyTokenNotification }))

      return
    }

    const res = await axios.delete(`${config.BASE_URL}/boards/${boardID}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (res.data) {
      dispatch(deleteBoardAction(boardID))
      dispatch(pushNewNotifications({ variant: 'success', message: NotificationTypes.succeedDeleteBoard }))
    }
  } catch (error) {
    dispatch(pushNewNotifications({ variant: 'error', message: NotificationTypes.failedDeleteBoard }))
  }
}
