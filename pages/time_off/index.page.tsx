import React, { useEffect } from 'react'
import TimeOffColumns from './UI/time_off_columns'
import { useDispatch, useSelector } from 'react-redux'
import { getMembersDaysOffApi } from './logic/time_off_apis'
import { RootState } from 'redux/reducers_registration'
import { TimeOffValueType } from './logic/time_off_interface'
import { updateOnSelectTimeOff } from './logic/time_off_actions'

const TimeOff = () => {
  const dispatch = useDispatch()
  const userInfo = useSelector((state: RootState) => state?.userInfo)
  const userID = userInfo?.userID
  const access = userInfo?.access
  const {
    membersTimeOffs,
    membersTimeOffsLoading,
    membersTimeOffsTotalCount,
    membersTimeOffsCursor,
    loadingIndex,
    loadingOptionStateName,
    updateStatusLoading,
    notFoundAnyMembersTimeOffs,
  }: TimeOffValueType = useSelector((state: RootState) => state.timeoff)

  useEffect(() => {
    if (membersTimeOffs?.length) {
      return
    }

    dispatch(getMembersDaysOffApi({ userID, cursor: membersTimeOffsCursor }))
  }, [access])

  function fetchMembersDaysOffData() {
    if (membersTimeOffsCursor === 'END') {

      return
    }

    dispatch(getMembersDaysOffApi({ userID, cursor: membersTimeOffsCursor, infiniteScroll: true }))
  }

  function acceptMemberDayOff({ itemIndex, baseTableName, timeOffID }) {
    if (updateStatusLoading) {
      return
    }

    dispatch(updateOnSelectTimeOff({
      onConfirm: true,
      onSelectTimeOffData: {
        timeOffID,
        fieldName: baseTableName,
        status: 'ACCEPTED',
        timeOffIndex: itemIndex,
      },
    }))
  }

  function rejectMemberDayOff({ itemIndex, baseTableName, timeOffID }) {
    if (updateStatusLoading) {
      return
    }

    dispatch(updateOnSelectTimeOff({
      onConfirm: true,
      onSelectTimeOffData: {
        timeOffID,
        fieldName: baseTableName,
        status: 'REJECTED',
        timeOffIndex: itemIndex,
      },
    }))
  }

  const actionFunc = {
    accept: acceptMemberDayOff,
    reject: rejectMemberDayOff,
  }

  return <TimeOffColumns
    timeOffs={membersTimeOffs}
    memberDisableButton={true}
    loading={membersTimeOffsLoading}
    title={'Members\' Time Off'}
    totalCount={membersTimeOffsTotalCount}
    fetchData={fetchMembersDaysOffData}
    actionFunc={actionFunc}
    name='membersTimeOffs'
    loadingIndex={loadingIndex}
    loadingOptionStateName={loadingOptionStateName}
    indexLoading={updateStatusLoading}
    notFoundAnyTimeOffs={notFoundAnyMembersTimeOffs}
  />
}

export default TimeOff
