import { checkIfEmptyArray } from './check_if_empty_array';
import { User } from './type';

export const checkAssignedUserID = (arr: string[], userID: string) => {
  if (!checkIfEmptyArray(arr)) {
    return false;
  }

  return arr.includes(userID);
};

export const checkAssignedUserByID = (arr?: User[], userID?: string) => {
  if (!checkIfEmptyArray(arr)) {
    return false;
  }

  return arr?.some((e) => e._id === userID);
};
