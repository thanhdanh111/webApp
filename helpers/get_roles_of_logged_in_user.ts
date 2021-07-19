import { Access } from './type'
import { Roles } from '../constants/roles'

interface GetRolesOfCompanies {
  access: Access[]
  filterCompanyID: string
}

interface ReturnRolesOfLoggedInUser {
  isAdmin: boolean
  rolesInCompany: Roles[]
  rolesInDepartments: RolesInDepartments
}

export interface RolesInDepartments {
  [departmentID: string]: Roles[]
}

export type GetRolesOfLoggedInUser = ReturnRolesOfLoggedInUser

const checkAccessWithFilterCompany = (access: Access, filterCompanyID: string) => {
  if (!access?.companyID || !access?.role || filterCompanyID !== access?.companyID) {
    return false
  }

  return true
}

export const getRolesOfLoggedInUser = ({ access, filterCompanyID }: GetRolesOfCompanies) => {
  let isAdmin = false
  const rolesInCompany: Roles[] = []
  const rolesInDepartments: RolesInDepartments = {}

  access.forEach((each) => {
    if (each?.role === Roles.ADMIN) {
      isAdmin = true

      return
    }

    if (!checkAccessWithFilterCompany(each, filterCompanyID)) {
      return
    }

    rolesInCompany.push(each.role as Roles)

    const departmentID = each?.departmentID as string

    if (!departmentID) {
      return
    }

    if (rolesInDepartments[departmentID] === undefined) {
      rolesInDepartments[departmentID] = []
    }

    rolesInDepartments[departmentID].push(each.role as Roles)
  })

  return {
    isAdmin,
    rolesInCompany,
    rolesInDepartments,
  }
}
