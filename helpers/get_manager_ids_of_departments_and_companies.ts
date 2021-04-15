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

    if (each?.role && each?.role === 'ADMIN') {
      isAdmin = true;

      return;
    }

    if (each.role === 'COMPANY_MANAGER') {
      managerCompanyIDs.push(each?.companyID);

      return;
    }

    if (!each.departmentID || each.role !== 'DEPARTMENT_MANAGER') {

      return;
    }

    managerDepartmentIDs.push(each.departmentID);
    companyIDsOfDepartmentManagers.push(each.companyID);
  });

  return {
    isAdmin,
    managerCompanyIDs,
    managerDepartmentIDs,
    companyIDsOfDepartmentManagers,
  };
};
