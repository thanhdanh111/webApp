import { TaskStatus } from '../../../helpers/type';
import { taskStatusesActionType } from './task_statuses_action_type';
import axios from 'axios';
import { config } from '../../../helpers/get_config';
import {
  createdStatus,
  deletedStatus,
  getStatusByID,
  renameStatus,
  setLoading,
} from './task_statuses_action';
import { pushNewNotifications } from '../../../redux/common/notifications/reducer';

export interface StatusesType {
  loading: boolean;
  statuses: { [key: string]: TaskStatus };
  currentStatusID: string;
  tempTitleStatus: string;
}

const initialState: StatusesType = {
  loading: false,
  statuses: {},
  currentStatusID: '',
  tempTitleStatus: '',
};

// tslint:disable-next-line:cyclomatic-complexity
export const statusesReducer = (state = initialState, action) => {
  switch (action.type) {
    case taskStatusesActionType.GET_STATUS_BY_ID:
      const taskStatus = {};
      taskStatus[action.payload?._id] = action.payload;

      return {
        ...state,
        statuses: { ...state.statuses, ...taskStatus },
      };
    case taskStatusesActionType.CREATE_STATUS:
      const newTAskStatus = {};
      newTAskStatus[action?.payload?._id] = action?.payload;

      return {
        ...state,
        statuses: { ...state.statuses, ...newTAskStatus },
      };
    case taskStatusesActionType.DELETE_STATUS:
      const deleteStatusID = action?.payload;
      const statuses = delete state.statuses?.[deleteStatusID];

      return {
        ...state,
        statuses,
      };
    case taskStatusesActionType.RENAME_STATUS:
      return {
        ...state,
        statuses: {
          ...state.statuses,
          [action.payload?._id]: action.payload,
        },
      };
    case taskStatusesActionType.SET_TEMP_TITLE_STATUS:
      return{
        ...state,
        tempTitleStatus: action.payload,
      };
    case taskStatusesActionType.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case taskStatusesActionType.SET_CURRENT_STATUS:
      if (action.payload === state.currentStatusID) {
        return {
          ...state,
        };
      }

      return {
        ...state,
        currentStatusID: action.payload,
      };
    default:
      return state;
  }
};

const notificationsType = {
  201: 'Created status to taskBoard successfully',
  400: 'You have no taskBoard right now!',
};

export const getStatusByIDThunkAction = (statusID: string) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');

    if (!token || !statusID) {
      return;
    }

    const res = await axios.get(`${config.BASE_URL}/taskStatuses/${statusID}`,
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

    await dispatch(getStatusByID(res.data));
    await dispatch(setLoading(false));
  } catch (error) {
    throw error;
  }
};

export const renameStatusThunkAction = (statusID: string) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token');
    const { tempTitleStatus }: StatusesType = getState().statuses;

    if (!token || !tempTitleStatus?.length || !statusID) {
      return;
    }

    const res = await axios({
      url: `${config.BASE_URL}/taskStatuses/${statusID}`,
      data: {
        title: tempTitleStatus,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method: 'PUT',
    });

    await dispatch(renameStatus(res.data));
    await dispatch(pushNewNotifications({ variant: 'success' , message: 'rename status successfully!' }));
  } catch (error) {
    const notification = notificationsType[error?.response?.status] || 'Something went wrong';
    await dispatch(pushNewNotifications({ variant: 'error' , message: notification }));
  }
};

export const createStatusThunkAction = (title: string) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token');
    const taskBoardID = getState().taskBoards?.currentTaskBoard?._id;

    if (!token || !taskBoardID || !title.trim()) {
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
    await dispatch(createdStatus(res.data));
    await dispatch(setLoading(false));
    await dispatch(pushNewNotifications({ variant: 'success' , message: notification }));
  } catch (error) {
    const notification = notificationsType[error?.response?.status] || 'Something went wrong';
    await dispatch(setLoading(false));
    await dispatch(pushNewNotifications({ variant: 'error' , message: notification }));
  }
};

export const deletedStatusThunkAction = (statusID: string) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');

    if (!token || !statusID) {
      return;
    }

    const res = await axios({
      url: `${config.BASE_URL}/taskStatuses/${statusID}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method: 'DELETE',
    });

    if (!res.data) {
      await dispatch(pushNewNotifications({ variant: 'error' , message: 'delete status unsuccess!' }));

      return;
    }

    await dispatch(deletedStatus(statusID));
    await dispatch(pushNewNotifications({ variant: 'success' , message: 'delete status successfully!' }));
  } catch (error) {
    const notification = notificationsType[error?.response?.status] || 'Something went wrong';
    await dispatch(pushNewNotifications({ variant: 'error' , message: notification }));
  }
};
