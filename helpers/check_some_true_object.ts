import { checkArray } from './check_array';

export const checkSomeTrueInArray = ({ conditionsArray }) => {
  if (!conditionsArray || !conditionsArray?.length) {
    return;
  }

  return conditionsArray.some((condition) => {
    if (Array.isArray(condition)) {
      return checkArray(condition);
    }

    return condition;
  });
};
