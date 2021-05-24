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

  access.forEach((each) => {
    if (!each?.companyID) {
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

    companies.push(each?.companyID);
  });

  return {
    isAdmin,
    companies,
  };
};
