import { dashboardClickUp } from './home_type';
import { Task, TaskStatusType } from '../../../helpers/type';
import axios from 'axios';
import { config } from 'helpers/get_config';
import { getDataTaskStatuses, hideLoaderListUser, getDataTasksByUserThunkAction, getTasksStatusByID } from './home_actions';

interface Data {
  loading: boolean;
  totalCount: number;
  cursor: string;
  list: TaskStatusType[];
  limit: number;
  listTasks: Task[];
  taskTotalCount: number;
  taskCursor: string;
  taskStatusNotification: TaskStatusType;
}

const initialState: Data = {
  loading: true,
  totalCount: 0,
  cursor: '',
  list: [],
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
};

export  const taskStatusesReducer = (state = initialState, action) => {
  switch (action.type) {
    case dashboardClickUp.SHOW_LOADER_LIST:
      return {
        ...state,
        loading: true,
      };
    case dashboardClickUp.HIDE_LOADER_LIST:
      return {
        ...state,
        loading: false,
      };
    case dashboardClickUp.GET_TASK_STATUSES:
      const listTaskStatus: TaskStatusType[] = [];

      action.payload.list.map((status) => {
        if (!status) {
          return;
        }
        listTaskStatus.push(status);
      });

      return {
        ...state,
        cursor: action.payload.cursor,
        totalCount: action.payload.totalCount,
        list: listTaskStatus,
      };
    case dashboardClickUp.GET_TASK:
      const listTask: Task[] = [];

      action.payload.listTask?.map((status) => {
        if (!status) {
          return;
        }
        listTask.push(status);
      });

      return {
        ...state,
        taskCursor: action.payload.cursor,
        taskTotalCount: listTask.length,
        listTasks: listTask,
      };
    case dashboardClickUp.GET_TASK_STATUS_BY_ID:
      return {
        ...state,
        taskStatusNotification: action.payload,
      };
    default:
      return state;
  }
};

export const getTaskStatusThunkAction = (companyID, departmentID) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');

    if (!token || !companyID) {
      await dispatch(hideLoaderListUser());

      return;
    }

    const res = await axios.get(`${config.BASE_URL}/taskStatuses`,
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
      await dispatch(hideLoaderListUser());

      return;
    }

    await dispatch(getDataTaskStatuses(res.data));
    await dispatch(hideLoaderListUser());

  } catch (error) {
    throw error;
  }
};

export const getTasksByUserThunkAction = (companyID, departmentID, user) => async (dispatch) => {
  try {
    const token = localStorage.getItem('access_token');

    if (!token || !companyID || !user?.userID) {
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
          userID: user.userID,
        },
      });

    if (res.data.totalCount === 0){
      await dispatch(hideLoaderListUser());

      return;
    }

    await dispatch(getDataTasksByUserThunkAction(res.data));
    await dispatch(hideLoaderListUser());

  } catch (error) {
    throw error;
  }
};

export const getTaskStatusByIDThunkAction = (taskStatusID) => async (dispatch) => {
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

    dispatch(getTasksStatusByID(res.data));
  } catch (error) {
    throw error;
  }
};
