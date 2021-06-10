import React, { useEffect } from 'react';
import ListUsers from './UI/users';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'redux/reducers_registration';
import { useRouter } from 'next/router';
import { getManagerIDs, GetManagerIDsType } from 'helpers/get_manager_ids_of_departments_and_companies';
import { updateUsersReducer } from './logic/users_actions';

const Users = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const access = useSelector((state: RootState) => state?.access);
  const companyID = useSelector((state: RootState) => state?.auth?.extendedCompany?.companyID?._id);

  useEffect(() => {
    const userAccesses = access?.access;
    const {
      isAdmin,
      managerCompanyIDs,
      managerDepartmentIDs,
      companyIDsOfDepartmentManagers,
    }: GetManagerIDsType = getManagerIDs({ access: userAccesses });

    const isManager = managerCompanyIDs.includes(companyID ?? '') ||
      companyIDsOfDepartmentManagers.includes(companyID ?? '');
    const validAccess = isAdmin || isManager;

    if (validAccess) {
      dispatch(updateUsersReducer({
        accountCompanyManagerIDs: managerCompanyIDs,
        accountDepartmentManagerIDs: managerDepartmentIDs,
      }));

      return;
    }

    void router.replace('/access_denied', '/access_denied.html');
  }, [access?.access]);

  return (
    <React.Fragment>
        <ListUsers />
    </React.Fragment>
  );
};

export default Users;
