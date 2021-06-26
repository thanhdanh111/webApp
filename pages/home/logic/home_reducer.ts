import { dashboardClickUp } from './home_type';
import { Task, TaskStatusType } from '../../../helpers/type';
import axios from 'axios';
import { config } from 'helpers/get_config';
import { getDataTaskStatuses, hideLoaderListUser, getDataTasksByUserThunkAction, getTasksStatusByID, addTask } from './home_actions';
import { pushNewNotifications } from 'redux/common/notifications/reducer';

interface UserAssigned {
  _id: string;
  profilePhoto: string;
  fullname: string;
}
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
  currentTaskStatus: string;
  newTask: Task;
  usersAssigned: UserAssigned[];
}

export enum NotificationTypes {
  failCreateTask = 'Failed Create Task',
  succeedCreateTask = 'Create Task Successfully',
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
  currentTaskStatus: '',
  newTask: { title: '' },
  usersAssigned: [],
};

// tslint:disable-next-line:cyclomatic-complexity
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
    case dashboardClickUp.ADD_TASK:
      const taskTypes = [...state.list];
      const index = taskTypes.findIndex((type) => type._id === action.payload.taskStatusID);
      taskTypes[index].taskIDs.unshift(action.payload);

      return {
        ...state,
        list: [...taskTypes],
        currentTaskStatus: '',
        usersAssigned: [],
      };
    case dashboardClickUp.SET_TYPE_CREATE_TASK:
      if (state.currentTaskStatus === action.payload){
        return { ...state };
      }

      return {
        ...state,
        currentTaskStatus: action.payload,
        newTask: { title: '' },
        usersAssigned: [],
      };
    case dashboardClickUp.UPDATE_NEW_TASK:

      return {
        ...state,
        newTask: { ...action.payload },
      };
    case dashboardClickUp.ASSIGN_USER:
      return {
        ...state,
        usersAssigned: [...state.usersAssigned, action.payload],
      };
    case dashboardClickUp.UNASSIGN_USER:
      return {
        ...state,
        usersAssigned: state.usersAssigned.filter((user) => action.payload !== user._id),
      };
    default:
      return state;
  }
};

export const getTaskStatusThunkAction = () => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token');
    const authState = getState().auth;
    const companyID = authState?.extendedCompany?.companyID?._id;
    const departmentID = authState?.department?._id;

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

export const getTasksByUserThunkAction = () => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token');
    const authState = getState().auth;
    const companyID = authState?.extendedCompany?.companyID?._id;
    const departmentID = authState?.department?._id;
    const userID = authState?.userID;

    if (!token || !companyID || !userID) {
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

export const addTaskThunkAction = (companyID) => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token || !companyID) {
      dispatch(pushNewNotifications({ variant: 'error' , message: NotificationTypes.failCreateTask }));

      return;
    }
    const res = await axios.post(`${config.BASE_URL}/companies/${companyID}/tasks`,
    getState().taskStatuses.newTask,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    dispatch(addTask(res.data));
    dispatch(pushNewNotifications({ variant: 'success' , message: NotificationTypes.succeedCreateTask }));
  } catch (error) {
    dispatch(
      pushNewNotifications({
        variant: 'error',
        message:
          error?.response?.data?.message || NotificationTypes.failCreateTask,
      }),
    );
    throw error;
  }
};
