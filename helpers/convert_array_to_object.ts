import { checkIfEmptyArray } from './check_if_empty_array';

export const convertArrayObjectToObject = (array: string[]) => {
  if (!checkIfEmptyArray(array)) {
    return { };
  }
  const obj = { };

  array.forEach((value, index) => obj[`userIDs[${index}]`] = value);

  return obj;
};
