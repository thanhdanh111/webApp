import { TableCell, TableRow, Avatar } from '@material-ui/core';
import React from 'react';
import moment from 'moment';
import BaseTable from '@components/table/table';
import { HeadCell } from 'helpers/type';
import CustomizedReturnActionComponent from './customized_return_user_detail';

const headCells: HeadCell[] = [
  { id: 'departmentName', numeric: false, disablePadding: true, label: 'Department' },
  { id: 'departmentRole', numeric: false, disablePadding: true, label: 'Department Role' },
  { id: 'status', numeric: false, disablePadding: true, label: 'Status' },
  { id: 'action', numeric: true, disablePadding: false, label: '' },
];

const UserDetail = (props) => {
  const info = props?.data?.user;
  const time = moment(info?.userID?.lastAccessAt).utc().format();

  function renderDepartmentRoles() {

    return <BaseTable
      headCells={headCells}
      data={props?.data?.departmentRoles}
      loading={false}
      length={props?.data?.departmentRoles?.length}
      fetchData={() => 'handled'}
      CustomizedReturnActionComponent={(funcProps) => <CustomizedReturnActionComponent {...funcProps} userData={props?.data} />}
      needCheckBox={false}
      actions={['delete']}
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
