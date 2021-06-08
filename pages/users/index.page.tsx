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
  const combinedUsersSelector = useSelector((state: RootState) => {

    return {
      access: state?.access,
      companyID: state?.auth?.extendedCompany?.companyID?._id,
    };
  });

  useEffect(checkInvalidAccess, [combinedUsersSelector.access]);

  function checkInvalidAccess() {
    const userAccesses = combinedUsersSelector?.access?.access;
    const {
      isAdmin,
      managerCompanyIDs,
      managerDepartmentIDs,
      companyIDsOfDepartmentManagers,
    }: GetManagerIDsType = getManagerIDs({ access: userAccesses });

    const isManager = isAdmin ||
      managerCompanyIDs.includes(combinedUsersSelector?.companyID ?? '') ||
      companyIDsOfDepartmentManagers.includes(combinedUsersSelector?.companyID ?? '');

    if (isManager) {
      dispatch(updateUsersReducer({
        accountCompanyManagerIDs: managerCompanyIDs,
        accountDepartmentManagerIDs: managerDepartmentIDs,
      }));

      return;
    }

    void router.replace('/access_denied', '/access_denied.html');
  }

  return (
    <React.Fragment>
        <ListUsers />
    </React.Fragment>
  );
};

export default Users;
