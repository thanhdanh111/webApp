import { dashboardClickUp } from './home_type';
import { Task, TaskStatusType } from '../../../helpers/type';
import axios from 'axios';
import { config } from 'helpers/get_config';
import {
  getDataTaskStatuses,
  hideLoaderListUser,
  getDataTasksByUserThunkAction,
  getTasksStatusByID,
  updateTaskByIDAction,
 } from './home_actions';

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
  selectTask: Task;
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
  selectTask: {
    _id: '',
    companyID: '',
    departmentID: '',
    tagIDs: [],
    userIDs: [],
    title: '',
    description: '',
  },
};

interface DataTaskStatusUpdate {
  taskIDs: string[];
}

interface UpdateTaskStatus {
  taskStatusID: string;
  data: DataTaskStatusUpdate;
}

let updatedTaskStatuses: TaskStatusType[];

interface UpdateTask {
  taskStatusID?: string;
  title?: string;
  description?: string;
  dueDate?: string;
  estimateDate?: string;
  timeTracked?: string;
  priority?: string;
  tagIDs?: string[];
}

interface IUpdateTask {
  taskID: string;
  data: UpdateTask;
}

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
    case dashboardClickUp.SET_TASKS_TO_TASK_STATUS:
      updatedTaskStatuses = state.list?.map((each) => {
        if (each._id !== action?.data?.taskStatusId) {
          return each;
        }

        return {
          ...each,
          taskIDs: action?.data.tasks,
        };
      });

      return {
        ...state,
        list: updatedTaskStatuses,
      };
    case dashboardClickUp.SET_SELECTED_TASK:
      return {
        ...state,
        selectTask: action?.data,
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
    const departmentID = '60487820340cd70008593306'; // authState?.department?._id;

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

export const updateTaskStatusById = ({ taskStatusID, data }: UpdateTaskStatus) => async () => {
  try {
    const localAccess = localStorage.getItem('access_token');

    await axios({
      data,
      url: `${config.BASE_URL}/taskStatuses/${taskStatusID}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localAccess}`,
      },
      method: 'PUT',
    });

  } catch (error) {
    // tslint:disable-next-line:no-console
    console.log('Update task status error', error);
  }
};

export const updateTaskById = ({ taskID, data = { } }: IUpdateTask) => async (dispatch, getState) => {
  try {
    const localAccess = localStorage.getItem('access_token');
    const authState = getState().auth;
    const companyID = authState?.extendedCompany?.companyID?._id;

    const res = await axios({
      data,
      url: `${config.BASE_URL}/companies/${companyID}/tasks/${taskID}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localAccess}`,
      },
      method: 'PUT',
    });

    await dispatch(updateTaskByIDAction(res));
  } catch (error) {
    throw error;
  }
};
