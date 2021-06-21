import { Roles } from 'constants/roles';
import { Access } from './type';

interface GetRolesOfCompanies {
  accesses: Access[];
  filterCompanyID: string;
}

interface ReturnRolesOfLoggedInUser {
  isAdmin: boolean;
  rolesInCompany: Roles[];
  rolesInDepartments: RolesInDepartments;
}

export interface RolesInDepartments {
  [departmentID: string]: Roles[];
}

export type GetRolesOfLoggedInUser = ReturnRolesOfLoggedInUser;

export const getRolesOfLoggedInUser = ({ accesses, filterCompanyID }: GetRolesOfCompanies) => {
  let isAdmin = false;
  const rolesInCompany: Roles[] = [];
  const rolesInDepartments: RolesInDepartments = {};

  accesses.forEach((each) => {
    if (each?.role === Roles.ADMIN) {
      isAdmin = true;

      return;
    }

    if (
      !each?.companyID ||
      !each?.role ||
      filterCompanyID !== each?.companyID
    ) {
      return;
    }

    const departmentID = each?.departmentID as string;

    if (departmentID && rolesInDepartments[departmentID] === undefined) {
      rolesInDepartments[departmentID] = [];
    }

    if (departmentID) {
      rolesInDepartments[departmentID].push(each.role as Roles);
    }

    rolesInCompany.push(each.role as Roles);
  });

  return {
    isAdmin,
    rolesInCompany,
    rolesInDepartments,
  };
};
