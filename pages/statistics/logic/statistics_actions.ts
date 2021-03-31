import { statisticsAction } from './statistics_type_action';

export const setUserID = (res: string) => {
  return {
    type: statisticsAction.SELECTED_USERID,
    payload: {
      userID: res,
    },
  };
};

export const limitStatistics = (res: number) => {
  return {
    type: statisticsAction.LIMIT_TRACKING,
    payload: {
      limit: res,
    },
  };
};

export const getAllStatistics = (res: object[]) => {
  return {
    type: statisticsAction.GET_LIST_CHECKIN_CHECKOUT,
    payload: {
      list: res,
    },
  };
};
