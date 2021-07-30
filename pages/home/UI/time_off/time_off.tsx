import { Typography } from '@material-ui/core'
import React, { FunctionComponent, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'redux/reducers_registration'
import { getMembersDaysOffApi } from 'pages/time_off/logic/time_off_apis'
import BaseTable from '@components/table/table'
import { TimeOffValueType } from 'pages/time_off/logic/time_off_interface'
import { HeadCell, UserInfoType } from 'helpers/type'
import { Roles } from 'constants/roles'
import { checkValidAccess } from 'helpers/check_valid_access'

export const headCells: HeadCell[] = [
  { id: 'companyName', numeric: false, disablePadding: true, label: 'Company Name' },
  { id: 'departmentName', numeric: false, disablePadding: true, label: 'Department Name' },
  { id: 'startTime', numeric: false, disablePadding: true, label: 'Start time' },
  { id: 'endTime', numeric: false, disablePadding: true, label: 'End time' },
  { id: 'status', numeric: false, disablePadding: true, label: 'Status' },
  { id: 'reason', numeric: false, disablePadding: true, label: 'Reason' },
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
]

const validAccesses = [Roles.COMPANY_MANAGER, Roles.DEPARTMENT_MANAGER]

const TimeOffTab: FunctionComponent = () => {
  const dispatch = useDispatch()
  const {
    isAdmin,
    rolesInCompany,
    userID,
  }: UserInfoType =  useSelector((state: RootState) => state?.userInfo)
  const loadMemberData = isAdmin || checkValidAccess({ rolesInCompany, validAccesses  })
  const today = new Date()

  const {
    membersTimeOffs,
    membersTimeOffsLoading,
    membersTimeOffsTotalCount,
    membersTimeOffsCursor,
    notFoundAnyMembersTimeOffs,
  }: TimeOffValueType = useSelector((state: RootState) => state.timeoff)

  useEffect(() => {
    void fetchDaysOffData()
  }, [userID])

  const fetchDaysOffData = () => {
    dispatch(getMembersDaysOffApi({ userID, limit: 100, infiniteScroll: true, cursor: membersTimeOffsCursor }))
  }

  return (
    <div className='daysoff-dashboard'>
    <Typography className='table-title' >DaysOff - {today.toLocaleString('default', { month: 'long' })}</Typography>

    {(loadMemberData && <BaseTable
      needStickyHeader={true}
      needCheckBox={false}
      headCells={headCells}
      data={membersTimeOffs}
      length={membersTimeOffsTotalCount}
      loading={membersTimeOffsLoading}
      actions={[]}
      fixedHeightInfiniteScroll={membersTimeOffs.length < 5 ? 100 : 300}
      fetchData={fetchDaysOffData}
      redButtonName='REJECT'
      baseTableName={'daysoff-table'}
      notFoundAnyData={notFoundAnyMembersTimeOffs}
      notFoundWarning='Not found any time offs today'
    />
    )}
    </div>
  )
}

export default TimeOffTab
