import { checkArray } from './check_array';

export const checkAssigned = (arr: string[], assignedID: string) => {
  if (checkArray(arr)) {
    return false;
  }

  return arr.includes(assignedID);
};
