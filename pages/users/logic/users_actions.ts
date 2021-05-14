import { usersAction } from './users_type_action';

export const showLoader = () => {
  return {
    type: usersAction.SHOW_LOADER_LIST,
  };
};

export const hideLoader = () => {
  return {
    type: usersAction.HIDE_LOADER_LIST,
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
