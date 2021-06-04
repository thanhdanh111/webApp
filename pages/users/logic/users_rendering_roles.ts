import { Access } from '../../../helpers/type';
import { checkArray } from '../../../helpers/check_array';
import { Roles, rolesRender } from 'constants/roles';

const companyRoles = [Roles.COMPANY_MANAGER, Roles.COMPANY_STAFF];

export const getRenderingRolesForUsersPage = (accesses, companyID) => {
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

    const notMatchCurrentCompany = access?.companyID?._id !== companyID;

    if (notMatchCurrentCompany || !access?.role) {

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
