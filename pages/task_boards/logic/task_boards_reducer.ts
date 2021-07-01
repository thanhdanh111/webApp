import { taskBoardsActionType } from './task_board_action_type';
import { TaskBoard, TaskStatus } from '../../../helpers/type';
import axios from 'axios';
import { config } from 'helpers/get_config';
import {
  setLoading,
  getTasksStatusByID,
  getTaskBoard,
  createdTaskBoard,
  setSelectedTaskBoard,
  getTaskStatus,
  createdTaskStatus,
} from './task_boards_action';
import { pushNewNotifications } from 'redux/common/notifications/reducer';

export interface TaskBoardsType {
  loading: boolean;
  taskStatus: { [key: string]: TaskStatus };
  currentTaskBoard: TaskBoard;
  taskBoards: TaskBoard[];
  hasNoData: boolean;
  onSendingRequest: boolean;
  filteringTaskByUser: boolean;
}

const initialState: TaskBoardsType = {
  loading: true,
  taskStatus: {},
  currentTaskBoard: {
    _id: '',
    title: '',
  },
  taskBoards: [],
  hasNoData: false,
  onSendingRequest: false,
  filteringTaskByUser: false,
};

// tslint:disable-next-line: cyclomatic-complexity
export  const taskBoardsReducer = (state = initialState, action) => {
  switch (action.type) {
    case taskBoardsActionType.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case taskBoardsActionType.FILTERING_TASK_BY_USER:
      return {
        ...state,
        filteringTaskByUser: action?.payload,
      };
    case taskBoardsActionType.SET_SELECTED_TASKBOARD:
      return {
        ...state,
        currentTaskBoard: action?.payload?.currentTaskBoard,
      };
    case taskBoardsActionType.GET_TASK_STATUS:
      const taskStatus = {};
      taskStatus[action.payload?._id] = action.payload;

      return {
        ...state,
        taskStatus: { ...state.taskStatus, ...taskStatus },
      };
    case taskBoardsActionType.GET_TASK_BOARD:
      return {
        taskBoards: action?.data?.list,
      };
    case taskBoardsActionType.CREATE_TASK_BOARD:
      return {
        ...state,
        taskBoards: [...state.taskBoards, action?.data],
      };
    case taskBoardsActionType.CREATE_TASK_STATUS:
      const newTAskStatus = {};
      newTAskStatus[action.data?._id] = action.data;

      return {
        ...state,
        currentTaskBoard: {
          ...state.currentTaskBoard,
          taskStatusIDs: [...(state.currentTaskBoard?.taskStatusIDs as string[]), action.data?._id],
        },
        taskStatus: { ...state.taskStatus, ...newTAskStatus },
      };
    default:
      return state;
  }
};

const notificationsType = {
  201: 'Created taskBoard to Company successfully',
  400: 'You have no taskBoard right now!',
};

export const getTaskStatusByIDThunkAction = (title, taskStatusID) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');

    if (!token || !taskStatusID) {
      return;
    }
    // title is targetEntityName
    const res = await axios.get(`${config.BASE_URL}/${title}/${taskStatusID}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

    if (!res.data) {
      await dispatch(setLoading(false));

      return;
    }

    await dispatch(getTasksStatusByID(res.data));
    await dispatch(setLoading(false));
  } catch (error) {
    throw error;
  }
};

export const getTaskStatusThunkAction = (taskStatusID) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');

    if (!token || !taskStatusID) {
      return;
    }

    const res = await axios.get(`${config.BASE_URL}/taskStatuses/${taskStatusID}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

    if (!res.data) {
      await dispatch(setLoading(false));

      return;
    }

    await dispatch(getTaskStatus(res.data));
    await dispatch(setLoading(false));
  } catch (error) {
    throw error;
  }
};

export const getTaskBoardThunkAction = () => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token');
    const userInfo = getState().userInfo;
    const companyID = userInfo.currentCompany._id;
    const departmentID = userInfo?.currentDepartment?._id;

    if (!token || !companyID) {
      return;
    }

    const res = await axios.get(`${config.BASE_URL}/taskBoards`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {
          companyID,
          departmentID,
        },
      });

    if (res.data.totalCount === 0){
      await dispatch(setLoading(false));

      return;
    }

    await dispatch(getTaskBoard(res?.data));
    await dispatch(setSelectedTaskBoard(res?.data?.list[0]));
    await dispatch(setLoading(false));
  } catch (error) {
    throw error;
  }
};

export const createTaskBoardThunkAction = (title, description) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token');
    const userInfo = getState().userInfo;
    const departmentID = userInfo?.currentDepartment?._id;

    if (!token) {
      return;
    }

    await dispatch(setLoading(true));

    const data = {
      title,
      description,
      departmentID,
    };

    const res = await axios.post(`${config.BASE_URL}/taskBoards`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

    const notification = notificationsType[res.status];
    await dispatch(createdTaskBoard(res.data));
    await dispatch(setLoading(false));
    await dispatch(pushNewNotifications({ variant: 'success' , message: notification }));
  } catch (error) {
    const notification = notificationsType[error?.response?.status] || 'Something went wrong';
    await dispatch(setLoading(false));
    await dispatch(pushNewNotifications({ variant: 'error' , message: notification }));
  }
};

export const createTaskStatusThunkAction = (title) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token');
    const taskBoardID = getState().taskBoards?.currentTaskBoard?._id;

    if (!token || !taskBoardID) {
      return;
    }

    await dispatch(setLoading(true));

    const data = {
      title,
      taskBoardID,
    };

    const res = await axios.post(`${config.BASE_URL}/taskStatuses`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

    const notification = notificationsType[res.status];
    await dispatch(createdTaskStatus(res.data));
    await dispatch(setLoading(false));
    await dispatch(pushNewNotifications({ variant: 'success' , message: notification }));
  } catch (error) {
    const notification = notificationsType[error?.response?.status] || 'Something went wrong';
    await dispatch(setLoading(false));
    await dispatch(pushNewNotifications({ variant: 'error' , message: notification }));
  }
};
