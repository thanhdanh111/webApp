export function checkEmptyObject(object) {
  if (!object || !Object.keys(object).length) {
    return true;
  }

  return false;
}
