import axios from 'axios';
import { search, setLoading, pagination, hasNoNotification, getNotificationsAction, updateUnreadNotifications } from './users_actions';
import { UsersData, HeadCell, ParamGetUser, Data, UserAccess, Access } from '../../../helpers/type';
import { config } from 'helpers/get_config';
import { useEffect, useState } from 'react';
import { usersAction } from './users_type_action';
import { rolesRender } from 'constants/roles';
import { getRenderingRolesForUsersPage } from './users_rendering_roles';

export const headCells: HeadCell[] = [
  { id: 'userName', numeric: false, disablePadding: true, label: 'User Name' },
  { id: 'companyRoleRender', numeric: false, disablePadding: true, label: 'Company Role' },
  { id: 'stringPendingRoles', numeric: false, disablePadding: true, label: 'Pending Roles' },
];

export const actionList: string[] = [];

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
  userLimit: 10,
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
  editingUserInfo: {},
  onRemovingUser: false,
  isLoading: false,
};

// tslint:disable-next-line: cyclomatic-complexity
export const usersReducer = (state = initialState, action) => {
  switch (action.type){
    case usersAction.SET_LOADING:
      return {
        ...state,
        loadingList: action.payload,
      };
    case usersAction.PAGINATION:
      let cursor = action.payload.cursor;
      const listNewUsers = action.payload.listNewUsers;

      if (listNewUsers?.length >= action.payload.totalCount) {
        cursor = 'END';
      }

      return {
        ...state,
        cursor,
        totalCount: action.payload.totalCount,
        list: [...state.list, ...listNewUsers],
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
        listSearch: action.payload.listSearchUsers,
      };
    case usersAction.HAS_NO_NOTIFICATION:
      return {
        ...state,
        hasNoData: true,
      };
    case usersAction.GET_NOTIFICATIONS:
      const listNotification = [...action.payload.list, ...state.notifications.list];
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
      const notifications = [...state.notifications?.list];
      const index = notifications.findIndex((notification) => notification._id === action.payload.selectNotification?._id);
      notifications[index].isRead = true;

      return {
        ...state,
        selectNotification: action.payload.selectNotification,
        notifications: {
          ...state.notifications,
          list: [...notifications],
          totalUnread: action.payload.totalUnread,
        },
      };
    case usersAction.GET_NOTIFICATIONS_FCM:
      return {
        ...state,
        notifications: {
          ...state.notifications,
          list: [action.payload, ...state.notifications.list],
          totalCount: state.notifications.totalCount + 1,
        },
      };
    case usersAction.UPDATE_USERS_REDUCER:
      return {
        ...state,
        ...action.data,
      };
    default:
      return state;
  }
};

export const getPaginationThunkAction = () => async (dispatch, getState) => {
  try {
    const userInfo = getState()?.userInfo;
    const token = localStorage.getItem('access_token');
    const cursor = getState().users?.cursor;
    const userLimit = getState().users?.userLimit;
    const accountUserID = userInfo?.userID;
    const companyID = userInfo?.currentCompany?._id;

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
      dispatch(setLoading(true));

      return;
    }

    const listNewUsers = renderData({
      accountUserID,
      users: res?.data?.list,
      rolesInCompany: userInfo?.rolesInCompany,
      rolesInDepartments: userInfo?.rolesInDepartments,
    });

    dispatch(pagination({ listNewUsers, ...res.data }));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setLoading(false));
  }
};

export const getSearchAction = (fullName) => async (dispatch, getState) => {
  try {
    const userInfo = getState()?.userInfo;
    const token = localStorage.getItem('access_token');
    const companyID = userInfo?.currentCompany?._id;
    const accountUserID = userInfo?.userID;

    if (!token || !companyID) {
      return;
    }

    dispatch(setLoading(true));

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

    const listSearchUsers = renderData({
      accountUserID,
      users: res?.data?.list,
      rolesInCompany: userInfo?.rolesInCompany,
      rolesInDepartments: userInfo?.rolesInDepartments,
    });

    dispatch(search({ listSearchUsers, ...res.data }));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setLoading(false));
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
  companyRole: string,
  companyRoleRender,
  departmentRoles: Access[],
  stringPendingRoles: string[],
  companyRoleCouldDelete,
): Data {

  return {
    id,
    userName,
    user,
    departmentRoles,
    companyRole,
    companyRoleRender,
    stringPendingRoles,
    companyRoleCouldDelete,
  };
}

export const renderData = ({
  users,
  accountUserID,
  rolesInCompany,
  rolesInDepartments,
}) => {
  return users.map((user: UserAccess) => {
    const exceptDeleteMyself = accountUserID === user.userID._id;
    const roles = getRenderingRolesForUsersPage({
      exceptDeleteMyself,
      rolesInCompany,
      rolesInDepartments,
      accesses: user.accesses,
    });
    const fullName = user?.userID?.status === 'INACTIVE' ? 'Inactive User' : `${user.userID.firstName} ${user.userID.lastName}`;
    const id = user._id;

    return createData(
      id,
      fullName,
      user,
      roles?.companyRole?.role,
      rolesRender[roles?.companyRole?.role],
      roles?.departmentRoles || [],
      roles?.stringPendingRoles || [],
      roles?.companyRole?.companyRoleCouldDelete,
    );
  });
};

export const getNotificationMiddleware = () => async (dispatch, getState) => {
  try {
    await dispatch(setLoading(true));

    const userInfo = getState()?.userInfo;
    const receiverID = userInfo?.userID;
    const token = localStorage.getItem('access_token');
    const cursor = getState()?.users?.notifications?.cursor;
    const notificationLimit = getState()?.users?.notificationLimit;

    if (!token || !receiverID || cursor === 'END') {
      await dispatch(setLoading(true));

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
        sortDirection: 'DESC',
        sortBy: 'createdAt',
        limit: notificationLimit,
      },
    });

    if (!res.data.totalCount || !res.data.list || !res.data.list.length) {
      await dispatch(hasNoNotification());
      await dispatch(setLoading(false));

      return;
    }

    await dispatch(getNotificationsAction(res.data));
    await dispatch(setLoading(false));
  } catch (error) {
    await dispatch(setLoading(false));
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
