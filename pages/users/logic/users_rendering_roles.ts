import { Access } from '../../../helpers/type';
import { checkArray } from '../../../helpers/check_array';
import { Roles, rolesRender } from 'constants/roles';
import { checkOnlyTrueInArray } from 'helpers/check_only_true';

const companyRoles = {
  COMPANY_MANAGER: {
    level: 1,
  },
  COMPANY_STAFF: {
    level: 0,
  },
};

export const getRenderingRolesForUsersPage = ({
  accesses,
  rolesInCompany,
  rolesInDepartments,
  exceptDeleteMyself,
}) => {
  if (!checkArray(accesses)) {
    return;
  }

  const stringPendingRoles: string[] = [];
  let companyRole;
  const departmentRoles: Access[] = [];
  const companyRoleCouldDelete = rolesInCompany?.includes(Roles.COMPANY_MANAGER) && !exceptDeleteMyself;

  for (const access of accesses) {
    const isPendingRole = access?.status !== 'ACCEPTED';
    const notHaveCurrentCompanyRole = checkOnlyTrueInArray({
      conditionsArray: [
        !companyRole,
        companyRoles?.[access?.role] !== undefined,
      ],
    });
    const roleGreaterThanCurrentRole = companyRoles[access?.role]?.level > companyRoles[companyRole?.role]?.level;

    if (notHaveCurrentCompanyRole || roleGreaterThanCurrentRole) {
      companyRole = {
        companyRoleCouldDelete,
        ...access,
      };

      continue;
    }

    if (companyRoles?.[access?.role] !== undefined) {

      continue;
    }

    if (isPendingRole) {
      stringPendingRoles.push(rolesRender[access?.role]);
    }

    const departmentID = access?.departmentID?._id;
    const departmentRolesCouldDelete = rolesInDepartments?.[departmentID]?.includes(Roles.DEPARTMENT_MANAGER);
    const canRemoveFromDepartment = checkOnlyTrueInArray({
      conditionsArray: [
        !exceptDeleteMyself,
        (companyRoleCouldDelete ||
        (departmentRolesCouldDelete && access.role !== Roles.DEPARTMENT_MANAGER)),
      ],
    });

    departmentRoles.push({
      canRemoveFromDepartment,
      ...access,
      departmentID: access?.departmentID?._id,
      departmentName: access?.departmentID?.name,
      departmentRole: rolesRender[access?.role],
    });
  }

  return { departmentRoles, companyRole, stringPendingRoles };
};
