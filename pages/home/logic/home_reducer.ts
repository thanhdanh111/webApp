import { dashboardClickUp } from './home_type';
import { Task, TaskBoard, TaskStatusType } from '../../../helpers/type';
import axios from 'axios';
import { config } from 'helpers/get_config';
import {
  setLoading,
  getDataTasksByUserThunkAction,
  getTasksStatusByID,
  getTaskBoard,
  createdTaskBoard,
  getTaskBoardByID,
  setSelectedTaskBoard,
} from './home_actions';
import { pushNewNotifications } from 'redux/common/notifications/reducer';

export interface HomeDataType {
  loading: boolean;
  limit: number;
  listTasks: Task[];
  taskTotalCount: number;
  taskCursor: string;
  taskStatusNotification: TaskStatusType;
  selectTaskBoardID: string;
  selectTaskBoard: TaskBoard;
  taskBoards: TaskBoard[];
  hasNoData: boolean;
  onSendingRequest: boolean;
}

const initialState: HomeDataType = {
  loading: true,
  limit: 5,
  listTasks: [],
  taskTotalCount: 0,
  taskCursor: '',
  taskStatusNotification: {
    _id: '',
    title: '',
    taskIDs: [],
    description: '',
  },
  selectTaskBoardID: '',
  selectTaskBoard: {
    _id: '',
    title: '',
  },
  taskBoards: [],
  hasNoData: false,
  onSendingRequest: false,
};

export  const taskStatusesReducer = (state = initialState, action) => {
  switch (action.type) {
    case dashboardClickUp.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case dashboardClickUp.GET_TASK_BY_USER_ID:
      return {
        ...state,
        taskCursor: action.payload.cursor,
        taskTotalCount: action.payload.totalCount,
        listTasks: action.payload.list,
      };
    case dashboardClickUp.SET_SELECTED_TASKBOARD:
      return {
        ...state,
        selectTaskBoardID: action?.payload?.selectTaskBoardID,
      };
    case dashboardClickUp.  GET_TASK_STATUS_BY_ID:
      return {
        ...state,
        taskStatusNotification: action.payload,
      };
    case dashboardClickUp.GET_TASK_BOARD:
      return {
        taskBoards: action?.data?.list,
      };
    case dashboardClickUp.CREATE_TASK_BOARD:
      return {
        ...state,
        taskBoards: [...state.taskBoards, action?.data],
      };
    case dashboardClickUp.GET_TASK_BOARD_BY_ID:
      return {
        ...state,
        selectTaskBoard: action?.data,
      };
    default:
      return state;
  }
};

const notificationsType = {
  201: 'Created taskBoard to Company successfully',
  400: 'You have no company right now!',
};

export const getTasksByUserThunkAction = (taskStatusID) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token');
    const authState = getState().auth;
    const companyID = authState?.extendedCompany?.companyID?._id;
    const departmentID = authState?.department?._id;
    const userID = authState?.userID;

    if (!token || !companyID || !userID || !taskStatusID) {
      return;
    }
    const res = await axios.get(`${config.BASE_URL}/tasks`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        params: {
          companyID,
          departmentID,
          userID,
          taskStatusID,
        },
      });

    if (res.data.totalCount === 0){
      await dispatch(setLoading(false));

      return;
    }

    await dispatch(getDataTasksByUserThunkAction(res.data));
    await dispatch(setLoading(false));

  } catch (error) {
    throw error;
  }
};

export const getTaskStatusByIDThunkAction = (tittle, taskStatusID) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');

    if (!token || !taskStatusID) {
      return;
    }
    // title is targetEntityName
    const res = await axios.get(`${config.BASE_URL}/${tittle}/${taskStatusID}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

    dispatch(getTasksStatusByID(res.data));
  } catch (error) {
    throw error;
  }
};

export const getTaskBoardThunkAction = () => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token');
    const authState = getState().auth;
    const companyID = authState?.extendedCompany?.companyID?._id;
    const departmentID = authState?.department?._id; // '60487820340cd70008593306'; //

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
    await dispatch(setSelectedTaskBoard(res?.data?.list[0]?._id));
    await dispatch(setLoading(false));
  } catch (error) {
    throw error;
  }
};

export const getTaskBoardByIDThunkAction = (taskBoardID) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token');
    const authState = getState().auth;
    const companyID = authState?.extendedCompany?.companyID?._id;
    const departmentID = authState?.department?._id; // '60487820340cd70008593306'; //

    if (!token || !companyID || !taskBoardID) {
      return;
    }

    const res = await axios.get(`${config.BASE_URL}/taskBoards/${taskBoardID}`,
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

    await dispatch(getTaskBoardByID(res.data));
  } catch (error) {
    throw error;
  }
};

export const createTaskBoardThunkAction = (title, description) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token');
    const departmentID = getState().auth?.department?._id;

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
    const taskBoardID = getState().auth?.department?._id;

    if (!token) {
      return;
    }

    await dispatch(setLoading(true));

    const data = {
      title,
      taskBoardID,
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
