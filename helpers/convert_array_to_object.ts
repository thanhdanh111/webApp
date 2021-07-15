import { checkIfEmptyArray } from './check_if_empty_array';

export const convertArrayStringToObject = (array: string[]) => {
  if (!checkIfEmptyArray(array)) {
    return { };
  }
  const obj = { };

  array.forEach((value, index) => obj[`userIDs[${index}]`] = value);

  return obj;
};

export function convertArrayObjectToObject<T>(array: T[], key: string){
  if (!checkIfEmptyArray(array)) {
    return { };
  }

  const obj = { };

  array.forEach((item) => obj[item[key]] = item);

  return obj;
}
