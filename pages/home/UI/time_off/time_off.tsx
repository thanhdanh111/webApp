
import { Box, Typography } from '@material-ui/core';
import React, { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers_registration';
import { getManagerIDs, GetManagerIDsType } from 'helpers/get_manager_ids_of_departments_and_companies';
import { getMembersDaysOffApi, getUserDaysOffApi } from 'pages/time_off/logic/time_off_apis';
import BaseTable from '@components/table/table';
import { TimeOffValueType } from 'pages/time_off/logic/time_off_interface';
import { HeadCell } from 'helpers/type';

export const headCells: HeadCell[] = [
  { id: 'companyName', numeric: false, disablePadding: true, label: 'Company Name' },
  { id: 'departmentName', numeric: false, disablePadding: true, label: 'Department Name' },
  { id: 'startTime', numeric: false, disablePadding: true, label: 'Start time' },
  { id: 'endTime', numeric: false, disablePadding: true, label: 'End time' },
  { id: 'status', numeric: false, disablePadding: true, label: 'Status' },
  { id: 'reason', numeric: false, disablePadding: true, label: 'Reason' },
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
];
const TimeOffTab: FunctionComponent = () => {

  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state?.auth);
  const userID = authState?.extendedUser?.userID;

  const {
    isAdmin,
    managerCompanyIDs,
    managerDepartmentIDs,
  }: GetManagerIDsType = getManagerIDs({ access: authState?.access });
  const loadMemberData = isAdmin || managerCompanyIDs?.length > 0 || managerDepartmentIDs?.length > 0;

  const today = new Date();

  const {
    ownTimeOffs,
    membersTimeOffs,
    ownTimeOffsLoading,
    membersTimeOffsLoading,
    ownTimeOffsTotalCount,
    membersTimeOffsTotalCount,
    loadingOptionStateName,
    notFoundAnyMembersTimeOffs,
    notFoundAnyOwnTimeOffs,
  }: TimeOffValueType = useSelector((state: RootState) => state.timeoff);

  useEffect(() => {
    void fetchDaysOffData();
  }, [userID, loadMemberData]);

  const fetchDaysOffData = async () => {
    if (loadMemberData) {
      dispatch(getMembersDaysOffApi({ userID, limit: 30, infiniteScroll: true, isExceptMeInMembers: false }));

      return;
    }
    dispatch(getUserDaysOffApi({ userID, limit: 30, infiniteScroll: true }));
  };

  return (
    <div className='daysoff-dashboard'>
      <Box className='daysoff-container shadow-container'>
        <Typography className='table-title' >DaysOff - {today.toLocaleString('default', { month: 'long' })}</Typography>
        {(!loadMemberData && <BaseTable
          needCheckBox={false}
          headCells={headCells}
          data={ownTimeOffs}
          length={ownTimeOffsTotalCount}
          loading={ownTimeOffsLoading}
          actions={[]}
          fetchData={fetchDaysOffData}
          redButtonName='REJECT'
          baseTableName={'daysoff-table'}
          individualActions={[]}
          loadingStateName={loadingOptionStateName}
          notFoundAnyData={notFoundAnyOwnTimeOffs}
          notFoundWarning='Not found any time offs today'
        />
        )}

        {(loadMemberData && <BaseTable
          needCheckBox={false}
          headCells={headCells}
          data={membersTimeOffs}
          length={membersTimeOffsTotalCount}
          loading={membersTimeOffsLoading}
          actions={[]}
          fetchData={fetchDaysOffData}
          redButtonName='REJECT'
          baseTableName={'daysoff-table'}
          individualActions={[]}
          loadingStateName={loadingOptionStateName}
          notFoundAnyData={notFoundAnyMembersTimeOffs}
          notFoundWarning='Not found any time offs today'
        />
        )}
      </Box>
    </div>
  );
};

export default TimeOffTab;
