import { dashboardClickUp } from './home_type';
import { TaskBoard, TaskStatus } from '../../../helpers/type';
import axios from 'axios';
import { config } from 'helpers/get_config';
import {
  setLoading,
  getTasksStatusByID,
  getTaskBoard,
  createdTaskBoard,
  setSelectedTaskBoard,
  getTaskStatuses,
} from './home_actions';
import { pushNewNotifications } from 'redux/common/notifications/reducer';

export interface HomeDataType {
  loading: boolean;
  taskStatus: { [key: string]: TaskStatus };
  currentTaskBoard: TaskBoard;
  taskBoards: TaskBoard[];
  hasNoData: boolean;
  onSendingRequest: boolean;
  filteringTaskByUser: boolean;
}

const initialState: HomeDataType = {
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

export  const taskStatusesReducer = (state = initialState, action) => {
  switch (action.type) {
    case dashboardClickUp.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case dashboardClickUp.FILTERING_TASK_BY_USER:
      return {
        ...state,
        filteringTaskByUser: action?.payload,
      };
    case dashboardClickUp.SET_SELECTED_TASKBOARD:
      return {
        ...state,
        currentTaskBoard: action?.payload?.currentTaskBoard,
      };
    case dashboardClickUp.GET_TASK_STATUSES:
      return {
        ...state,
        taskStatus: action.payload,
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
    default:
      return state;
  }
};

const notificationsType = {
  201: 'Created taskBoard to Company successfully',
  400: 'You have no company right now!',
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
    await dispatch(setSelectedTaskBoard(res?.data?.list[0]));

    const dataRes: TaskStatus[] = await Promise.all(res?.data?.list[0]?.taskStatusIDs?.map((item) => {
      return new Promise(async (rel) => {
        // item string _id => get api for each _id
        const taskStatusRes = await axios.get(`${config.BASE_URL}/taskStatuses/${item}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

        rel(taskStatusRes?.data);
      });
    }));

    const hash: { [key: string]: TaskStatus } = {};
    dataRes.forEach((item: TaskStatus) => {
      hash[item._id] = item;
    });

    await dispatch(getTaskStatuses(hash));
    await dispatch(setLoading(false));
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
