import { Roles } from 'constants/roles';
import { Access } from './type';

interface GetRolesOfCompanies {
  accesses: Access[];
}

interface ReturnRolesOfCompanies {
  isAdmin: boolean;
  rolesOfCompanies: RolesOfCompanyMap;
}

interface RolesInCompany {
  rolesInCompany: Roles[];
  [departmentID: string]: Roles[];
}

export interface RolesOfCompanyMap {
  [companyID: string]: RolesInCompany;
}

export type GetRolesOfCompaniesMap = ReturnRolesOfCompanies;

export const getRolesOfCompaniesMap = ({ accesses }: GetRolesOfCompanies) => {
  let isAdmin = false;
  const rolesOfCompanies = { };

  accesses.forEach((each) => {
    if (!each?.companyID || !each?.role) {
      return;
    }

    if (each.role === Roles.ADMIN) {
      isAdmin = true;

      return;
    }

    const companyID = each?.companyID as string;
    const departmentID = each?.departmentID as string;

    if (rolesOfCompanies[companyID] === undefined) {
      rolesOfCompanies[companyID] = { };
      rolesOfCompanies[companyID].rolesInCompany = [];
    }

    if (departmentID && rolesOfCompanies[companyID][departmentID] === undefined) {
      rolesOfCompanies[companyID][departmentID] = [];
    }

    if (departmentID) {
      rolesOfCompanies[companyID][departmentID].push(each.role);
    }

    rolesOfCompanies[companyID].rolesInCompany.push(each.role);
  });

  return {
    isAdmin,
    rolesOfCompanies,
  };
};
