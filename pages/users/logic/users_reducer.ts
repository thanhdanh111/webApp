import axios from 'axios';
import { search, setLoading, pagination, hasNoNotification, getNotificationsAction, updateUnreadNotifications } from './users_actions';
import { UsersData, HeadCell, ParamGetUser, Data, UserAccess } from '../../../helpers/type';
import { config } from 'helpers/get_config';
import { useEffect, useState } from 'react';
import { getDepartmentsName } from '../../../helpers/get_department_name';
import { getRole } from '../../../helpers/get_role';
import { usersAction } from './users_type_action';

export const headCells: HeadCell[] = [
  { id: 'userName', numeric: false, disablePadding: true, label: 'UserName' },
  { id: 'departments', numeric: false, disablePadding: true, label: 'Departments' },
  { id: 'activeRoles', numeric: false, disablePadding: true, label: 'ActiveRoles' },
  { id: 'pendingRoles', numeric: false, disablePadding: true, label: 'PendingRoles' },
  { id: 'action', numeric: false, disablePadding: true, label: 'Action' },
];

export const actionList: string[] = ['Edit', 'Delete'];

const initialState: UsersData = {
  cursor: '',
  list: [],
  listSearch: [],
  notifications: {
    cursor: '',
    list: [],
    totalCount: 0,
    totalUnread: 0,
  },
  hasNoData: false,
  loadingList: true,
  totalCount: 0,
  status: 'string',
  userLimit: 5,
  notificationLimit: 10,
  selectNotification: {
    _id: '',
    isRead: false,
    body: '',
    clickAction: '',
    targetEntityName: '',
    event: '',
    title: '',
    createdAt: '',
    receiverUID: '',
    companyID: '',
    targetID: '',
  },
};

export const usersReducer = (state = initialState, action) => {
  switch (action.type){
    case usersAction.SET_LOADING:
      return {
        ...state,
        loadingList: action.payload,
      };
    case usersAction.PAGINATION:
      const listUser = [...state.list, ...action.payload.list];
      let cursor = action.payload.cursor;

      if (listUser >= action.payload.totalCount) {
        cursor = 'END';
      }

      return {
        ...state,
        cursor,
        totalCount: action.payload.totalCount,
        list: [...state.list, ...action.payload.list],
      };
    case usersAction.SEARCH:
      let newCursor = action.payload.cursor;
      if (action.payload.totalCount <= state.userLimit) {
        newCursor = 'END';
      }

      return {
        ...state,
        cursor: newCursor,
        totalCount: action.payload.totalCount,
        listSearch: action.payload.list,
      };
    case usersAction.HAS_NO_NOTIFICATION:
      return {
        ...state,
        hasNoData: true,
      };
    case usersAction.GET_NOTIFICATIONS:
      const listNotification = [...state.notifications.list, ...action.payload.list];
      let cursorNotification = action.payload.cursor;

      if (listNotification >= action.payload.totalCount) {
        cursorNotification = 'END';
      }

      return {
        ...state,
        notifications: {
          cursor: cursorNotification,
          list: [...state.notifications.list, ...action.payload.list],
          totalCount: action.payload.totalCount,
          totalUnread: action.payload.totalUnread,
        },
        hasNoData: true,
      };
    case usersAction.UPDATE_NOTIFICATION:
      return {
        ...state,
        selectNotification: action.payload.selectNotification,
        notifications: {
          ...state.notifications,
          totalUnread: action.payload.totalUnread,
        },
      };
    default:
      return state;
  }
};

export const getPaginationThunkAction = () => async (dispatch, getState) => {
  try {
    const authState = getState().auth;
    const token = localStorage.getItem('access_token');
    const cursor = getState().users?.cursor;
    const userLimit = getState().users?.userLimit;
    const companyID = authState?.extendedCompany?.companyID?._id;

    if (cursor === 'END' || !token || !companyID) {
      return;
    }

    const res =
       await axios.get(`${config.BASE_URL}/userAccesses?companyID=${companyID}&limit=${userLimit}&cursor=${cursor}`, {
         headers: {
           'Content-Type': 'application/json',
           Authorization: `Bearer ${token}`,
         },
       });

    if (res.data.totalCount === 0){
      await dispatch(setLoading(true));

      return;
    }

    await dispatch(pagination(res.data));
    await dispatch(setLoading(false));
  } catch (error) {
    throw error;
  }
};

export const getSearchAction = (fullName) => async (dispatch, getState) => {
  try {
    const authState = getState().auth;
    const token = localStorage.getItem('access_token');
    const companyID = authState?.extendedCompany?.companyID?._id;

    if (!token || !companyID) {
      return;
    }

    const params: ParamGetUser = {
      companyID,
      fullName,
    };

    const res =
     await axios.get(`${config.BASE_URL}/userAccesses`, {
       params,
       headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
       },
     });

    await dispatch(search(res.data));
    await dispatch(setLoading(false));
  } catch (error) {
    throw error;
  }
};

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value]);

  return debouncedValue;
};

function createData(
  id: string,
  userName: string,
  user: UserAccess,
  departments: string[],
  activeRoles: string[],
  pendingRoles: string[],
): Data {
  return { id, userName, user, departments, activeRoles, pendingRoles };
}

export const renderData = (users: UserAccess[]) => {
  return users.map((each: UserAccess) => {
    const departments = getDepartmentsName(each.departmentID);
    const roles = getRole(each.accesses);
    const fullName = `${each.userID.firstName} ${each.userID.lastName}`;
    const id = each.userID._id;
    const user = each;

    return createData(
      id,
      fullName,
      user,
      departments || [],
      roles?.activeRoles || [],
      roles?.pendingRoles || [],
    );
  });
};

export const getNotificationMiddleware = () => async (dispatch, getState) => {
  try {
    await dispatch(setLoading(true));

    const authState = getState().auth;
    const receiverID = authState?.userID;
    const token = localStorage.getItem('access_token');
    const cursor = getState()?.users?.notifications?.cursor;
    const notificationLimit = getState()?.users?.notificationLimit;

    if (!token || !receiverID || cursor === 'END') {
      return;
    }

    const res = await axios.get(`${config.BASE_URL}/notifications`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      params: {
        cursor,
        receiverID,
        limit: notificationLimit,
      },
    });

    if (!res.data.totalCount || !res.data.list || !res.data.list.length) {
      await dispatch(hasNoNotification());
      await dispatch(setLoading(false));
    }

    await dispatch(getNotificationsAction(res.data));
    await dispatch(setLoading(true));
  } catch (error) {
    throw error;
  }
};

export const updateUnreadNotificationMiddleware = (notificationID: string, isRead: boolean) => async (dispatch, getState) => {
  try {
    const state = getState();
    const token = localStorage.getItem('access_token');

    if (!token || !notificationID) {
      return;
    }

    const res = await axios.put(`${config.BASE_URL}/notifications/${notificationID}`,
      {
        isRead,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const resultUpdateUnreadNotification = {
      selectNotification: res.data,
      totalUnread: state?.notifications?.totalUnread - 1,
    };

    dispatch(updateUnreadNotifications(resultUpdateUnreadNotification));
  } catch (error) {
    throw error;
  }
};
