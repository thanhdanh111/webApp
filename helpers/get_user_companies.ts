import { Access } from './type';

interface GetUserCompanies {
  access: Access[];
  filterRoles?: string[];
}

export const getUserCompanies = ({ access, filterRoles }: GetUserCompanies) => {
  if (!access || !access?.length) {
    return {
      isAdmin: false,
      companies: [],
    };
  }

  const companies: string[] = [];
  let isAdmin = false;
  const filteredCompanies = { };

  access.forEach((each, index) => {
    const companyID = each?.companyID;

    if (!companyID || filteredCompanies[companyID] !== undefined) {
      return;
    }

    if (each?.role && each?.role === 'ADMIN') {
      isAdmin = true;

      return;
    }

    const isNotSuitRole = filterRoles &&
      filterRoles?.length &&
      !filterRoles.includes(each?.role);

    if (isNotSuitRole) {
      return;
    }

    filteredCompanies[companyID] = index;
    companies.push(companyID);
  });

  return {
    isAdmin,
    companies,
  };
};
