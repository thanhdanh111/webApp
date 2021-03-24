import { Access } from './type';
import { checkArray } from './check_array';

export const getRole = (accesses) => {

  if (!checkArray(accesses)) {
    return;
  }

  const activeRoles: string[] = [];
  const pendingRoles: string[] = [];

  accesses.map((access: Access) => {
    if (access.status === 'ACCEPTED') {
      return activeRoles.push(access.role);
    }

    if (access.status.toUpperCase() !== 'ACCEPTED') {
      return pendingRoles.push(access.role);
    }

    return;
  });

  return { activeRoles, pendingRoles };
};
