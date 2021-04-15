export const checkOnlyTrueInArray = ({ conditionsArray }) => {
  if (!conditionsArray || !conditionsArray?.length) {
    return;
  }

  return conditionsArray.every((condition) => condition);
};
