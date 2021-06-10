import { Roles } from 'constants/roles';
import { checkArray } from './check_array';
export const isAdminOrManagerUser = (accesses, companyID, departmentID) => {
  if (!checkArray(accesses)) {
    return false;
  }

  for (const access of accesses) {

    if (access.status !== 'ACCEPTED') {
      continue;
    }

    const isAdmin = access?.role === Roles.ADMIN;

    const isCompanyManager = access?.role === Roles.COMPANY_MANAGER && access?.companyID === companyID;

    const isDepartmentManager =
      access?.role === Roles.DEPARTMENT_MANAGER && access?.companyID === companyID && access?.departmentID === departmentID;
    if (isAdmin || isCompanyManager || isDepartmentManager) {

      return true;
    }

    continue;
  }

  return false;
};
