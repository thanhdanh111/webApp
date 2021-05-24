import { TableCell, TableRow, Avatar } from '@material-ui/core';
import React from 'react';
import moment from 'moment';

const UserDetail = (props) => {
  const info = props?.data?.user;
  const time = moment(info?.userID?.lastAccessAt).utc().format();

  return (
    <>
    <TableRow>
      <TableCell><Avatar src={info?.userID?.profilePhoto}/></TableCell>
      <TableCell >
        <TableRow className='row-info'>{info?.userID?.email} </TableRow>
        <TableRow>{info?.companyID?.address}</TableRow>
        <TableRow>{time}</TableRow>
      </TableCell>
      </TableRow>
    </>
  );
};
export default UserDetail;
