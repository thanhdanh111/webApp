import { checkArray } from './check_array';
import { User } from './type';

export const checkAssignedUserID = (arr: string[], userID: string) => {
  if (!checkArray(arr)) {
    return false;
  }

  return arr.includes(userID);
};

export const checkAssignedUserByID = (arr?: User[], userID?: string) => {
  if (!checkArray(arr)) {
    return false;
  }

  return arr?.some((e) => e._id === userID);
};
