import React from 'react';
import { Box, Typography, IconButton } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import PersonIcon from '@material-ui/icons/Person';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import { updateOnConfirmDialog, updateOptionState } from '../logic/time_off_actions';
import BaseTable from '@components/table/table';
import { HeadCell } from 'helpers/type';
import { ConfirmDialog } from './confirm_dialog';
import { RootState } from 'redux/reducers_registration';
import { TimeOffValueType } from '../logic/time_off_interface';
import { changeStatusOfTimeOff } from '../logic/time_off_apis';

export const headCells: HeadCell[] = [
  { id: 'companyName', numeric: false, disablePadding: true, label: 'Company Name' },
  { id: 'departmentName', numeric: false, disablePadding: true, label: 'Department Name' },
  { id: 'startTime', numeric: false, disablePadding: true, label: 'Start time' },
  { id: 'endTime', numeric: false, disablePadding: true, label: 'End time' },
  { id: 'status', numeric: false, disablePadding: true, label: 'Status' },
  { id: 'reason', numeric: false, disablePadding: true, label: 'Reason' },
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'action', numeric: false, disablePadding: true, label: 'Action' },
];

export const actionList: string[] = ['accept', 'reject', 'cancel'];

const individualActions: string[] = ['cancel'];

const TimeOffColumns = ({
  timeOffs,
  title,
  meDisableButton,
  memberDisableButton,
  totalCount,
  loading,
  fetchData,
  actionFunc,
  name,
  loadingIndex,
  loadingOptionStateName,
  indexLoading,
  notFoundAnyTimeOffs,
}) => {
  const dispatch = useDispatch();
  const { onConfirm, onSelectTimeOffData }: TimeOffValueType = useSelector((state: RootState) => state.timeoff);
  const status = onSelectTimeOffData?.status ?? 'CONTINUE';

  function handleNavigateOptionsState(optionStateName) {
    if (!optionStateName) {
      return;
    }

    dispatch(updateOptionState({ optionState: optionStateName }));
  }

  function onCloseDialog() {
    dispatch(updateOnConfirmDialog({ onConfirm: false }));
  }

  function handleYes() {
    dispatch(updateOnConfirmDialog({ onConfirm: false }));
    dispatch(changeStatusOfTimeOff());
  }

  return <div className='time-off-columns--container'>
    <div className='time-off-colummns--options'>
      <IconButton
        onClick={() => handleNavigateOptionsState('me')}
        name='me'
        disabled={meDisableButton}
        disableRipple
        disableFocusRipple
        size='medium'
      >
        <PersonIcon name='me' color={meDisableButton ? 'primary' : 'secondary'} />
      </IconButton>
      <IconButton
        onClick={() => handleNavigateOptionsState('members')}
        name='members'
        disabled={memberDisableButton}
        disableRipple
        disableFocusRipple
        size='medium'
      >
        <PeopleAltIcon name='members' color={memberDisableButton ? 'primary' : 'secondary'}  />
      </IconButton>
    </div>

    <ConfirmDialog onOpen={onConfirm} status={status} handleYes={handleYes} handleClose={onCloseDialog}/>
    <Box className='own-time-off-column'>
      <Typography className='time-off-columns--title' color='primary' variant='h5'>
        {title}
      </Typography>

        <BaseTable
          needCheckBox={false}
          headCells={headCells}
          data={timeOffs}
          length={totalCount}
          loading={loading}
          actions={actionList}
          fetchData={fetchData}
          redButtonName='REJECT'
          actionFunc={actionFunc}
          baseTableName={name}
          individualActions={individualActions}
          loadingIndex={loadingIndex}
          loadingStateName={loadingOptionStateName}
          indexLoading={indexLoading}
          notFoundAnyData={notFoundAnyTimeOffs}
          notFoundWarning='Not found any time offs today'
        />
    </Box>
  </div>;
};

export default TimeOffColumns;
