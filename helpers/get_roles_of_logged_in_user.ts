import { Access } from './type';
import { Roles } from '../constants/roles';

interface GetRolesOfCompanies {
  access: Access[];
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

export const getRolesOfLoggedInUser = ({ access, filterCompanyID }: GetRolesOfCompanies) => {
  let isAdmin = false;
  const rolesInCompany: Roles[] = [];
  const rolesInDepartments: RolesInDepartments = {};

  access.forEach((each) => {
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
