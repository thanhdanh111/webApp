import { Access } from '../../../helpers/type'
import { checkIfEmptyArray } from '../../../helpers/check_if_empty_array'
import { Roles, rolesRender } from 'constants/roles'
import { checkOnlyTrueInArray } from 'helpers/check_only_true'

const companyRoles = {
  COMPANY_MANAGER: {
    level: 1,
  },
  COMPANY_STAFF: {
    level: 0,
  },
}

export const getRenderingRolesForUsersPage = ({
  accesses,
  rolesInCompany,
  rolesInDepartments,
  exceptDeleteMyself,
}) => {
  if (!checkIfEmptyArray(accesses)) {
    return
  }

  const stringPendingRoles: string[] = []
  let companyRole
  const departmentRoles: Access[] = []
  const companyRoleCouldDelete = rolesInCompany?.includes(Roles.COMPANY_MANAGER) && !exceptDeleteMyself

  const checkRoleCompany = (access) => {
    const isPendingRole = access?.status !== 'ACCEPTED'
    const notHaveCurrentCompanyRole = checkOnlyTrueInArray({
      conditionsArray: [
        !companyRole,
        companyRoles?.[access?.role] !== undefined,
      ],
    })
    const roleGreaterThanCurrentRole = companyRoles[access?.role]?.level > companyRoles[companyRole?.role]?.level

    if (notHaveCurrentCompanyRole || roleGreaterThanCurrentRole) {
      companyRole = {
        companyRoleCouldDelete,
        ...access,
      }

      return false
    }

    if (companyRoles?.[access?.role] !== undefined) {

      return false
    }

    if (isPendingRole) {
      stringPendingRoles.push(rolesRender[access?.role])
    }

    return true
  }

  const checkRoleDepartment = (access) => {
    const departmentID = access?.departmentID?._id
    const departmentRolesCouldDelete = rolesInDepartments?.[departmentID]?.includes(Roles.DEPARTMENT_MANAGER)

    return checkOnlyTrueInArray({
      conditionsArray: [
        !exceptDeleteMyself,
        (companyRoleCouldDelete ||
        (departmentRolesCouldDelete && access.role !== Roles.DEPARTMENT_MANAGER)),
      ],
    })
  }

  for (const access of accesses) {
    if (!checkRoleCompany(access)) {
      continue
    }

    const canRemoveFromDepartment = checkRoleDepartment(access)

    departmentRoles.push({
      canRemoveFromDepartment,
      ...access,
      departmentID: access?.departmentID?._id,
      departmentName: access?.departmentID?.name,
      departmentRole: rolesRender[access?.role],
    })
  }

  return { departmentRoles, companyRole, stringPendingRoles }
}
