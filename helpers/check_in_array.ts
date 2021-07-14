import { checkIfEmptyArray } from './check_if_empty_array';

export const checkInArrayString = (arr: string[], userID: string) => {
  if (!checkIfEmptyArray(arr)) {
    return false;
  }

  return arr.includes(userID);
};
export function checkHasObjectByKey<T>(arr: T[], value: string, key: string): boolean {
  if (!checkIfEmptyArray(arr)) {
    return false;
  }

  return arr?.some((e) => e?.[key] === value);
}
