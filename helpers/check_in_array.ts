import { checkIfEmptyArray } from './check_if_empty_array';

export const checkInArrayString = (arr: string[], userID: string) => {
  if (!checkIfEmptyArray(arr)) {
    return false;
  }

  return arr.includes(userID);
};

export function checkArrayObjectHasObjectByKey<T>(arr: T[], value: string, key: string): boolean {
  if (!checkIfEmptyArray(arr)) {
    return false;
  }

  return arr?.some((e) => e?.[key] === value);
}

export function checkHasObjectByKey<T>(obj: T, value: string, key: string): boolean {
  if (!obj) {
    return false;
  }

  return obj[key] === value;
}
