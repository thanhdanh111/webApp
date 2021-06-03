import { TableCell, TableRow, Avatar, Button } from '@material-ui/core';
import React from 'react';
import moment from 'moment';
import BaseTable from '@components/table/table';
import { HeadCell } from 'helpers/type';
import { useDispatch } from 'react-redux';
import { updateUsersReducer } from 'pages/users/logic/users_actions';

const headCells: HeadCell[] = [
  { id: 'departmentName', numeric: false, disablePadding: true, label: 'Department' },
  { id: 'departmentRole', numeric: false, disablePadding: true, label: 'Department Role' },
  { id: 'status', numeric: false, disablePadding: true, label: 'Status' },
  { id: 'action', numeric: true, disablePadding: false, label: '' },
];

const UserDetail = (props) => {
  const info = props?.data?.user;
  const time = moment(info?.userID?.lastAccessAt).utc().format();
  const dispatch = useDispatch();

  function removeUserFromDepartment(departmentIndex) {

    dispatch(updateUsersReducer({
      onRemovingUser: true,
      editingUserInfo: {
        ...props.data,
        departmentName: props?.data?.departmentRoles?.[departmentIndex]?.departmentName,
        departmentID: props?.data?.departmentRoles?.[departmentIndex]?.departmentID,
        accessID: props?.data?.departmentRoles?.[departmentIndex]?._id,
        userIndex: props?.index,
      },
    }));
  }

  const actionFunc = {
    delete: removeUserFromDepartment,
    accept: () => 'not-handled-now',
  };

  const CustomizedReturnActionComponent = (funcProps) => {
    let actionList = ['delete'];

    if (funcProps?.status === 'ACCEPTED') {
      actionList = ['delete'];
    }

    return (
      <ul
        style={{ justifyContent: 'center' }}
        className='list-action'
      >
        {actionList.map((action, index) => {
          const colorButton = (action.toUpperCase() === 'DELETE') ? 'redButton' : '';

          return (
            <li className='action-item' key={index}>
              <Button
                variant='contained'
                color='secondary'
                className={`${colorButton} action`}
                onClick={() => actionFunc?.[action]?.(funcProps?.itemIndex)}
              >
                {action}
              </Button>
            </li>
          );
        })}
      </ul>
    );
  };

  function renderDepartmentRoles() {

    return <BaseTable
      headCells={headCells}
      data={props?.data?.departmentRoles}
      loading={false}
      length={props?.data?.departmentRoles?.length}
      fetchData={() => 'handled'}
      CustomizedReturnActionComponent={CustomizedReturnActionComponent}
      needCheckBox={false}
      actions={['accept', 'delete']}
      redButtonName='delete'
      hadExpandableRows={false}
    />;
  }

  return (
    <div className='user-detail'>
    <TableRow component='div'>
      <TableCell style={{ borderBottom: 'none' }}  ><Avatar src={info?.userID?.profilePhoto}/></TableCell>
      <TableCell style={{ borderBottom: 'none' }}>
        <TableRow className='row-info'>{info?.userID?.email} </TableRow>
        <TableRow>{info?.companyID?.address}</TableRow>
        <TableRow style={{ borderBottom: 'none' }} >{time}</TableRow>
      </TableCell>
    </TableRow>
      {
        !!props?.data?.departmentRoles?.length &&
        renderDepartmentRoles()
      }
    </div>
  );
};

export default UserDetail;
