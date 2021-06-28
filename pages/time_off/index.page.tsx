import React, { useEffect } from 'react';
import TimeOffColumns from './UI/time_off_columns';
import { useDispatch, useSelector } from 'react-redux';
import { getMembersDaysOffApi, getUserDaysOffApi } from './logic/time_off_apis';
import { RootState } from 'redux/reducers_registration';
import { OptionState, TimeOffValueType } from './logic/time_off_interface';
import { updateOnSelectTimeOff } from './logic/time_off_actions';

const TimeOff = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state?.userInfo);
  const userID = userInfo?.userID;
  const accesses = userInfo?.accesses;
  const {
    optionState,
    ownTimeOffs,
    membersTimeOffs,
    ownTimeOffsLoading,
    ownTimeOffsCursor,
    membersTimeOffsLoading,
    ownTimeOffsTotalCount,
    membersTimeOffsTotalCount,
    membersTimeOffsCursor,
    loadingIndex,
    loadingOptionStateName,
    updateStatusLoading,
    notFoundAnyMembersTimeOffs,
    notFoundAnyOwnTimeOffs,
  }: TimeOffValueType = useSelector((state: RootState) => state.timeoff);

  useEffect(() => {
    if (membersTimeOffsLoading || membersTimeOffs.length || !accesses?.length) {

      return;
    }

    dispatch(getMembersDaysOffApi({ userID, limit: 30 }));
  }, [accesses]);

  useEffect(() => {
    if (ownTimeOffsLoading || !userID || ownTimeOffs.length || !accesses?.length) {

      return;
    }

    dispatch(getUserDaysOffApi({ userID, limit: 30, cursor: membersTimeOffsCursor }));
  }, [userID, accesses]);

  function fetchUserDaysOffData() {
    dispatch(getUserDaysOffApi({ userID , limit: 30, cursor: ownTimeOffsCursor, infiniteScroll: true }));
  }

  function fetchMembersDaysOffData() {
    dispatch(getMembersDaysOffApi({ userID, limit: 30, cursor: membersTimeOffsCursor, infiniteScroll: true }));
  }

  function acceptMemberDayOff({ itemIndex, baseTableName, timeOffID }) {
    if (updateStatusLoading) {
      return;
    }

    dispatch(updateOnSelectTimeOff({
      onConfirm: true,
      onSelectTimeOffData: {
        timeOffID,
        fieldName: baseTableName,
        status: 'ACCEPTED',
        timeOffIndex: itemIndex,
      },
    }));
  }

  function rejectMemberDayOff({ itemIndex, baseTableName, timeOffID }) {
    if (updateStatusLoading) {
      return;
    }

    dispatch(updateOnSelectTimeOff({
      onConfirm: true,
      onSelectTimeOffData: {
        timeOffID,
        fieldName: baseTableName,
        status: 'REJECTED',
        timeOffIndex: itemIndex,
      },
    }));
  }

  const actionFunc = {
    accept: acceptMemberDayOff,
    reject: rejectMemberDayOff,
  };

  if (optionState === OptionState.me) {
    return <TimeOffColumns
      meDisableButton={true}
      memberDisableButton={false}
      loading={ownTimeOffsLoading}
      timeOffs={ownTimeOffs}
      title='Your Time Off'
      totalCount={ownTimeOffsTotalCount}
      fetchData={fetchUserDaysOffData}
      actionFunc={actionFunc}
      name='ownTimeOffs'
      loadingIndex={loadingIndex}
      loadingOptionStateName={loadingOptionStateName}
      indexLoading={updateStatusLoading}
      notFoundAnyTimeOffs={notFoundAnyOwnTimeOffs}
    />;
  }

  return <TimeOffColumns
    timeOffs={membersTimeOffs}
    meDisableButton={false}
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
  />;
};

export default TimeOff;
