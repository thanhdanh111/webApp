export const checkIsAdmin = (accesses) => {
  for  (const element of accesses) {
    if (element.name !== 'ADMIN') {
      continue;
    }

    return true;
  }

  return false;
};
