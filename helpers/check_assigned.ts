import { checkArray } from './check_array';
import { User } from './type';

export const checkInArrayString = (arr: string[], userID: string) => {
  if (!checkArray(arr)) {
    return false;
  }

  return arr.includes(userID);
};

export const checkInObjectByID = (arr?: User[], userID?: string) => {
  if (!checkArray(arr)) {
    return false;
  }

  return arr?.some((e) => e._id === userID);
};
