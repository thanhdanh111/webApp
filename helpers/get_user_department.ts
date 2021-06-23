import { checkArray } from './check_array';
import { Access } from './type';

interface GetUserDepartments {
  access: Access[];
  filterRoles?: string[];
  companyID: string;
}

export const getUserDepartments = ({ access, filterRoles, companyID }: GetUserDepartments) => {
  if (!checkArray(access)) {
    return {
      isAdmin: false,
      departments: [],
    };
  }

  const departments: string[] = [];
  let isAdmin = false;

  access.forEach((each) => {
    if (each.companyID === companyID) {
      if (!each?.departmentID) {
        return;
      }

      if (each?.role && each?.role === 'ADMIN') {
        isAdmin = true;

        return;
      }

      const isNotSuitRole = filterRoles &&
        filterRoles?.length &&
        !filterRoles.includes(each?.role);

      if (isNotSuitRole) {
        return;
      }

      departments.push(each?.departmentID);
    }

    return;
  });

  return {
    isAdmin,
    departments,
  };
};
