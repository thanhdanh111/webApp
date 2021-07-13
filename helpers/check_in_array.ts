import { checkArray } from './check_array';

export const checkInArrayString = (arr: string[], userID: string) => {
  if (!checkArray(arr)) {
    return false;
  }

  return arr.includes(userID);
};

export function checkInObject<T>(arr: T[], userID: string, key: string): boolean {
  if (!checkArray(arr)) {
    return false;
  }

  return arr?.some((e) => e?.[key] === userID);
}
