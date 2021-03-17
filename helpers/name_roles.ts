export const roleName = (roleID, listRoles) => {
  for (const element of listRoles) {
    if (element.roleID !== roleID) {
      continue;
    }

    return element.name;
  }

  return false;
};
