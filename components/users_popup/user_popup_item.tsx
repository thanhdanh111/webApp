import { Avatar, Box, MenuItem } from '@material-ui/core'
import { UserAccess } from 'helpers/type'

interface InitProps {
  userAccess: UserAccess
  handleAssign?: (event) => void
  isAssigned?: boolean
}
const UserItem: React.FC<InitProps> = (props) => {
  const { userAccess, handleAssign, isAssigned }: InitProps = props

  return (
    <MenuItem key={userAccess?._id} onClick={handleAssign} className='menu-item-users-popup'>
      <Box
        display='flex'
        alignItems='center'
        className={isAssigned ? 'user-accept' : 'user-unaccept'}
      >
        <Avatar
          src={userAccess.userID?.profilePhoto}
          className='avata-popup'
        />
        <span className='name-popup'>
          {(userAccess.userID?.firstName?.trim() || userAccess.userID?.lastName?.trim())
          ? `${userAccess.userID?.firstName} ${userAccess.userID?.lastName}`
          : `${userAccess?.userID?.email}`}
        </span>
      </Box>
    </MenuItem>
  )
}
export default UserItem
