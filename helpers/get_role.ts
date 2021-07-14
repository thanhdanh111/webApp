import { Access } from './type';
import { checkIfEmptyArray } from './check_if_empty_array';

export const getRole = (access) => {

  if (!checkIfEmptyArray(access)) {
    return;
  }

  const activeRoles: string[] = [];
  const pendingRoles: string[] = [];

  access.map((each: Access) => {
    if (each.status === 'ACCEPTED') {
      return activeRoles.push(each.role);
    }

    if (each.status.toUpperCase() !== 'ACCEPTED') {
      return pendingRoles.push(each.role);
    }

    return;
  });

  return { activeRoles, pendingRoles };
};
