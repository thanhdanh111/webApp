import { usersAction } from './users_type_action';

export const setLoading = (loading: boolean) => {
  return {
    type: usersAction.SET_LOADING,
    payload: loading,
  };
};

export const pagination = (res: object) => {
  return{
    type: usersAction.PAGINATION,
    payload: res,
  };
};

export const search = (res: object) => {
  return{
    type: usersAction.SEARCH,
    payload: res,
  };
};

export const hasNoNotification = () => {
  return {
    type: usersAction.HAS_NO_NOTIFICATION,
  };
};

export const getNotificationsAction = (res: object) => {
  return {
    type: usersAction.GET_NOTIFICATIONS,
    payload: res,
  };
};

export const getNotificationFCM = (res: object) => {
  return {
    type: usersAction.GET_NOTIFICATIONS_FCM,
    payload: res,
  };
};

export const updateUnreadNotifications = (res: object) => {
  return {
    type: usersAction.UPDATE_NOTIFICATION,
    payload: res,
  };
};

export const updateUsersReducer = (data) => {
  return {
    data,
    type: usersAction.UPDATE_USERS_REDUCER,
  };
};
