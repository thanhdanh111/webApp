interface Department {
  departmentID?: string;
  name: string;
}

export interface Company {
  companyID: string;
  name: string;
  departments: Department[];
}

export const getDepartmentsIntoCompanies = ({ departments }) => {
  if (!departments || !departments.length) {
    return [];
  }

  const storeCompaniesIndice = { };
  const companies: Company[] = [];

  let indexForNewTempCompany = 0;

  departments.forEach((department) => {
    if (!department || !department?.companyID) {
      return;
    }

    const companyID = department?.companyID?._id ?? department?.companyID;
    let indexOfTempCompany = storeCompaniesIndice[companyID];

    if (typeof indexOfTempCompany !== 'number') {
      storeCompaniesIndice[companyID] = indexForNewTempCompany;
      indexOfTempCompany = indexForNewTempCompany;

      companies[indexForNewTempCompany] = {
        companyID,
        name: department?.companyID?.name,
        departments: [],
      };

      indexForNewTempCompany = indexForNewTempCompany + 1;
    }

    let departmentsOfCompany =  companies[indexOfTempCompany]['departments'];

    departmentsOfCompany = [
      ...departmentsOfCompany,
      {
        departmentID: department._id,
        name: department.name,
      },
    ];

    companies[indexOfTempCompany]['departments'] = departmentsOfCompany;
  });

  return companies;
};
