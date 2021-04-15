export function checkManager(type, timeOff, managerCompanyIDs, managerDepartmentIDs) {
  if (type === 'members') {
    return true;
  }

  const isCompanyManager =  (
    !!managerCompanyIDs?.length &&
    managerCompanyIDs.includes(timeOff?.companyID?._id)
  );
  const isDepartmentManager = (
    !!managerDepartmentIDs?.length &&
    managerDepartmentIDs.includes(timeOff?.departmentID?._id)
  );

  return isCompanyManager || isDepartmentManager;
}
