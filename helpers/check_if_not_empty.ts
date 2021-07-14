import { checkIfEmptyArray } from './check_if_empty_array';

export const checkIfNotEmpty = ({ feilds }) => {
  if (!feilds) {
    return;
  }

  return feilds.some((field) => {
    if (Array.isArray(field)) {
      return checkIfEmptyArray(field);
    }

    return true;
  });
};
