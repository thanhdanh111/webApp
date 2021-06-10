import { Access } from '../../../helpers/type';
import { checkArray } from '../../../helpers/check_array';
import { Roles, rolesRender } from 'constants/roles';
import { checkOnlyTrueInArray } from 'helpers/check_only_true';

const companyRoles = [Roles.COMPANY_MANAGER, Roles.COMPANY_STAFF];

export const getRenderingRolesForUsersPage = ({
  accesses,
  companyID,
  accountDepartmentMangerIDs,
  accountCompanyManagerIDs,
  exceptDeleteMyself,
}) => {
  if (!checkArray(accesses)) {
    return;
  }

  const stringPendingRoles: string[] = [];
  let companyRole;
  const departmentRoles: Access[] = [];
  const accountIsCompanyManager = accountCompanyManagerIDs.includes(companyID);

  for (const access of accesses) {
    const isPendingRole = access?.status !== 'ACCEPTED';
    const isCompanyRole =  access?.companyID?._id === companyID &&
      companyRoles.includes(access?.role ?? '');

    if (isCompanyRole) {
      companyRole = {
        accountIsCompanyManager,
        ...access,
      };

      continue;
    }

    const notMatchCurrentCompany = access?.companyID?._id !== companyID;

    if (notMatchCurrentCompany || !access?.role) {

      continue;
    }

    if (isPendingRole) {
      stringPendingRoles.push(rolesRender[access?.role]);
    }

    const accountIsDepartmentManager = accountDepartmentMangerIDs.includes(access?.departmentID?._id);
    const canDelete = checkOnlyTrueInArray({
      conditionsArray: [
        !exceptDeleteMyself,
        (accountIsCompanyManager ||
        (accountIsDepartmentManager && access.role !== Roles.DEPARTMENT_MANAGER)),
      ],
    });

    departmentRoles.push({
      canDelete,
      ...access,
      departmentID: access?.departmentID?._id,
      departmentName: access?.departmentID?.name,
      departmentRole: rolesRender[access?.role],
    });
  }

  return { departmentRoles, companyRole, stringPendingRoles };
};
