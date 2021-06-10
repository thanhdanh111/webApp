export function checkManager(type, timeOff, managerCompanyIDs, managerDepartmentIDs) {
  if (type === 'members') {
    return true;
  }

  const isCompanyManager =  (
    !!managerCompanyIDs?.length &&
    timeOff?.companyID?._id &&
    managerCompanyIDs.includes(timeOff.companyID._id)
  );
  const isDepartmentManager = (
    !!managerDepartmentIDs?.length &&
    timeOff?.departmentID?._id &&
    managerDepartmentIDs.includes(timeOff.departmentID._id)
  );

  return isCompanyManager || isDepartmentManager;
}
