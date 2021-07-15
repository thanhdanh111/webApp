import { Task, User } from '../../../helpers/type';
import axios from 'axios';
import { config } from '../../../helpers/get_config';
import { taskActionType } from './task_action_type';
import { createdTask, getTaskByID, setLoading } from './task_action';
import { convertArrayObjectToObject } from '../../../helpers/convert_array_to_object';
import { pushNewNotifications } from 'redux/common/notifications/reducer';
import { NotificationTypes } from 'pages/task_boards/logic/task_boards_reducer';

export interface TaskType {
  loading: boolean;
  tasks: { [key: string]: Task };
  isCreatedTask: boolean;
  temporaryTask: Task;
  temporaryAssigned: User[];
}

const initialState: TaskType = {
  loading: false,
  tasks: {},
  isCreatedTask: false,
  temporaryTask: {
    _id: '',
    taskStatusID: '',
    title: '',
  },
  temporaryAssigned: [],
};

// tslint:disable-next-line:cyclomatic-complexity
export const tasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case taskActionType.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case taskActionType.GET_TASKS:

      return {
        ...state,
        tasks: action.payload,
      };
    case taskActionType.SET_ASSIGNED:

      return {
        ...state,
        temporaryAssigned: action.payload,
      };
    case taskActionType.SET_TEMPORARY_TASK:
      return {
        ...state,
        temporaryTask: { ...action.payload },
      };
    case taskActionType.CREATE_TASK:
      return {
        ...state,
        tasks: { ...state.tasks, ...action?.payload },
      };
    default:
      return state;
  }
};

// const notificationsType = {
//   201: 'Created task to status successfully',
//   400: 'You have no task right now!',
// };

export const getTasksThunkAction = () => async (dispatch, getState) => {
  try {
    await dispatch(setLoading(true));
    const token = localStorage.getItem('access_token');
    const userInfo = getState()?.userInfo;
    const companyID = userInfo?.currentCompany?._id;

    if (!token) {
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
        },
      });

    if (!res.data) {
      await dispatch(setLoading(false));

      return;
    }

    const formatData = res.data?.list.map((each) => {
      return {
        ...each,
        taskStatusID: each?.taskStatusID?._id || each?.taskStatuaID,
      };
    });

    const tasks = convertArrayObjectToObject<Task>(formatData, '_id');

    await dispatch(getTaskByID(tasks));
    await dispatch(setLoading(false));
  } catch (error) {
    throw error;
  }
};

export const createdTaskThunkAction = () => async (dispatch, getState) => {
  try {
    const token = localStorage.getItem('access_token');
    const userInfo = getState()?.userInfo;
    const companyID = userInfo?.currentCompany?._id;
    const dataCreated = getState().tasks?.temporaryTask;

    await dispatch(setLoading(true));

    if (!token || !companyID) {
      dispatch(pushNewNotifications({ variant: 'error' , message: NotificationTypes.failCreateTask }));

      return;
    }
    const res = await axios.post(`${config.BASE_URL}/companies/${companyID}/tasks`,
      dataCreated,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    await dispatch(createdTask(res.data));
    await dispatch(pushNewNotifications({ variant: 'success' , message: NotificationTypes.succeedCreateTask }));
    await dispatch(setLoading(false));
  } catch (error) {
    await dispatch(
      pushNewNotifications({
        variant: 'error',
        message:
          error?.response?.data?.message || NotificationTypes.failCreateTask,
      }),
    );
    await dispatch(setLoading(false));
    throw error;
  }
};
