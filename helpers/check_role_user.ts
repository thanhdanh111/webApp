import { checkArray } from './check_array';
export const isAdminOrManagerUser = (accesses, companyID, departmentID) => {
  if (!checkArray(accesses)) {
    return false;
  }

  for (const access of accesses) {

    if (access.status !== 'ACCEPTED') {
      continue;
    }

    const isAdmin = access?.role === 'ADMIN';

    const isCompanyManager = access?.role === 'COMPANY_MANAGER' && access?.companyID === companyID;

    const isDepartmentManager =
      access?.role === 'DEPARTMENT_MANAGER' && access?.companyID === companyID && access?.departmentID === departmentID;

    if (isAdmin || isCompanyManager || isDepartmentManager) {
      return true;
    }

    continue;
  }

  return false;
};
