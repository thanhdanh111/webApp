import { TableCell, TableRow, Avatar, Button } from '@material-ui/core'
import React from 'react'
import moment from 'moment'
import BaseTable from '@components/table/table'
import { HeadCell } from 'helpers/type'
import CustomizedControlCell from './customized_control_cell'
import { updateUsersReducer } from 'pages/users/logic/users_actions'
import { useDispatch } from 'react-redux'

const headCells: HeadCell[] = [
  { id: 'departmentName', numeric: false, disablePadding: true, label: 'Department' },
  { id: 'departmentRole', numeric: false, disablePadding: true, label: 'Department Role' },
  { id: 'status', numeric: false, disablePadding: true, label: 'Status' },
  { id: 'action', numeric: true, disablePadding: false, label: 'Action' },
]

const UserDetail = (props) => {
  const info = props?.data?.user
  const time = moment(info?.userID?.lastAccessAt).utc().format()
  const dispatch = useDispatch()

  function removeUserFromCompany() {
    dispatch(updateUsersReducer({
      onRemovingUser: true,
      editingUserInfo: {
        editingCompany: {
          ...props?.data.user?.companyID,
          companyRole: props?.data?.companyRole,
        },
        userData: props?.data?.user,
        userName: props?.data?.userName,
        removeUserFrom: 'company',
      },
    }))
  }

  function renderDepartmentRoles() {

    return <BaseTable
      headCells={headCells}
      data={props?.data?.departmentRoles}
      loading={false}
      length={props?.data?.departmentRoles?.length}
      fetchData={() => 'handled'}
      needStickyHeader={false}
      CustomizedCellAtLastColumn={
        (funcProps) =>
        <CustomizedControlCell
          {...funcProps}
          userIndex={props?.index}
          userData={props?.data}
        />
      }
      needCheckBox={false}
      actions={['delete']}
      redButtonName='delete'
      hadExpandableRows={false}
    />
  }

  return (
    <div className='user-detail'>
    <TableRow style={{ alignItems: 'center', display: 'flex' }} component='div'>
      <TableCell style={{ borderBottom: 'none' }}  ><Avatar src={info?.userID?.profilePhoto}/></TableCell>
      <TableCell style={{ borderBottom: 'none' }}>
        <TableRow className='row-info'>{info?.userID?.email} </TableRow>
        <TableRow>{info?.companyID?.address}</TableRow>
        <TableRow style={{ borderBottom: 'none' }} >{time}</TableRow>
      </TableCell>
      <TableCell style={{ borderBottom: 'none', textAlign: 'end', flexGrow: 4 }}>
      {
        props?.data?.companyRoleCouldDelete &&
        <Button
          style={{
            color: 'white',
            fontWeight: 600 ,
            backgroundColor: 'rgba(244, 67, 54, 0.90)',
            padding: '5px 15px',
          }}
          onClick={() => removeUserFromCompany()}
        >
          Remove
        </Button>
      }
      </TableCell>
    </TableRow>
      {
        !!props?.data?.departmentRoles?.length &&
        renderDepartmentRoles()
      }
    </div>
  )
}

export default UserDetail
