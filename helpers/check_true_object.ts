export const checkTrueInObject = (object: object) => {
  if (!object) {
    return false;
  }

  const keyOfObject = Object.keys(object);

  if (!keyOfObject?.length) {
    return false;
  }

  const isValid = keyOfObject.every((each) => {
    if (typeof object[each] === 'object') {
      return checkTrueInObject(object[each]);
    }

    return object[each] ? true : false;
  });

  return isValid;
};
