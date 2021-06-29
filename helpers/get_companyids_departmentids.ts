import { Access } from './type';

interface GetUserCompanies {
  access: Access[];
}

interface GetUserCompanyIDsAndDepartmentIDs {
  companyIDs: string[];
  departmentIDs: string[];
  companyIDsOfDepartmentIDs: string[];
}

export type GetUserCompanyIDsAndDepartmentIDsType = GetUserCompanyIDsAndDepartmentIDs;

export const getUserCompanyIDsAndDepartmentIDs = ({
  access,
}: GetUserCompanies): GetUserCompanyIDsAndDepartmentIDs => {
  if (!access || !access?.length) {
    return {
      companyIDs: [],
      departmentIDs: [],
      companyIDsOfDepartmentIDs: [],
    };
  }

  const companyIDs: string[] = [];
  const departmentIDs: string[] = [];
  const companyIDsOfDepartmentIDs: string[] = [];
  const filteredCompanies = { };
  const filteredDepartmentIDs = { };

  access.forEach((each, index) => {
    const companyID = each?.companyID as string;
    const departmentID = each?.departmentID as string;
    const filteredCompanyID = (!departmentID && filteredCompanies[companyID] !== undefined);

    if (!companyID || filteredCompanyID) {
      return;
    }

    if (!departmentID) {
      filteredCompanies[companyID] = index;
      companyIDs.push(companyID);

      return;
    }

    if (filteredDepartmentIDs[departmentID] !== undefined) {

      return;
    }

    filteredDepartmentIDs[departmentID] = index;
    departmentIDs.push(departmentID);
    companyIDsOfDepartmentIDs.push(companyID);
  });

  return {
    companyIDs,
    departmentIDs,
    companyIDsOfDepartmentIDs,
  };
};
