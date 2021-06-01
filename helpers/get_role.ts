import { Access } from './type';
import { checkArray } from './check_array';
import { rolesRender } from 'constants/roles';

const companyRoles = ['COMPANY_STAFF', 'COMPANY_MANAGER'];

export const getRole = (accesses, companyID) => {
  if (!checkArray(accesses)) {
    return;
  }

  const stringPendingRoles: string[] = [];
  let companyRole;
  const departmentRoles: Access[] = [];

  for (const access of accesses) {
    const isPendingRole = access?.status !== 'ACCEPTED';
    const isCompanyRole =  access?.companyID?._id === companyID &&
      companyRoles.includes(access?.role);

    if (isCompanyRole) {
      companyRole = access;

      continue;
    }

    const notMatchCurrentCompany = access?.companyID?._id !== companyID &&
    companyRoles.includes(access?.role);

    if (notMatchCurrentCompany) {

      continue;
    }

    if (isPendingRole) {
      stringPendingRoles.push(rolesRender[access?.role]);
    }

    departmentRoles.push({
      ...access,
      departmentID: access?.departmentID?._id,
      departmentName: access?.departmentID?.name,
      departmentRole: rolesRender[access?.role],
    });
  }

  return { departmentRoles, companyRole, stringPendingRoles };
};
