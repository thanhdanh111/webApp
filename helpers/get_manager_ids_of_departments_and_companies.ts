import { Roles } from 'constants/roles';
import { Access } from './type';

interface GetUserCompanies {
  access: Access[];
  filterRoles?: string[];
}

interface GetManagerIDs {
  isAdmin: boolean;
  managerCompanyIDs: string[];
  managerDepartmentIDs: string[];
  companyIDsOfDepartmentManagers: string[];
}

export type GetManagerIDsType = GetManagerIDs;

export const getManagerIDs = ({ access }: GetUserCompanies) => {
  let isAdmin = false;
  const managerCompanyIDs: string[] = [];
  const managerDepartmentIDs: string[] = [];
  const companyIDsOfDepartmentManagers: string[] = [];

  access.forEach((each) => {
    if (!each?.companyID || !each?.role) {
      return;
    }

    const companyID = each?.companyID as string;

    if (each?.role && each?.role === 'ADMIN') {
      isAdmin = true;

      return;
    }

    if (each.role === Roles.COMPANY_MANAGER) {
      managerCompanyIDs.push(companyID);

      return;
    }

    const departmentID = each?.departmentID as string;

    if (!departmentID || each.role !== Roles.DEPARTMENT_MANAGER) {

      return;
    }

    managerDepartmentIDs.push(departmentID);
    companyIDsOfDepartmentManagers.push(companyID);
  });

  return {
    isAdmin,
    managerCompanyIDs,
    managerDepartmentIDs,
    companyIDsOfDepartmentManagers,
  };
};
