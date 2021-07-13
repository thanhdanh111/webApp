import { checkArray } from './check_array';

export const convertArrayObjectToObject = (array: string[]) => {
  if (!checkArray(array)) {
    return { };
  }
  const obj = { };

  array.forEach((value, index) => obj[`userIDs[${index}]`] = value);

  return obj;
};
