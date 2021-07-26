import { Menu } from '@material-ui/core'
import { RootStateOrAny, useSelector } from 'react-redux'
import GroupUserAssigned from './group_user_assigned'
import UsersPopupUI from 'components/users_popup/users_popup'
import { User } from 'helpers/type'
import { checkArrayObjectHasObjectByKey } from 'helpers/check_in_array'
import { useState } from 'react'

interface InitialProps {
  usersAssigned: (User)[]
  handleAssign: (users) => void
  sizes: string
}

const AssignUser: React.FC<InitialProps> = (props) => {
  const userInfo = useSelector((state: RootStateOrAny) => state.userInfo)
  const { usersAssigned, handleAssign, sizes }: InitialProps = props
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const handleUsersAssign = (user) => {
    let tempAssign = usersAssigned || []
    const checkAssignedOfUser = checkArrayObjectHasObjectByKey(usersAssigned, user?.userID?._id, '_id')

    if (checkAssignedOfUser && usersAssigned?.length){

      tempAssign = usersAssigned?.filter((each) => user?.userID?._id !== each._id)

      return handleAssign(tempAssign)
    }

    tempAssign = [...tempAssign, user?.userID]

    return handleAssign(tempAssign)
  }

  return (
    <>
      <div className='choose-assign-user' onClick={handleClick}>
        <GroupUserAssigned
          currentUser={userInfo}
          usersAssigned={usersAssigned}
          sizes={sizes}
        />
      </div>
      <Menu
        open={!!anchorEl}
        anchorEl={anchorEl}
        autoFocus={false}
        className='user-popup'
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={() => setAnchorEl(null)}
      >
        <UsersPopupUI
          chooseUser={handleUsersAssign}
          usersAssigned={usersAssigned}
        />
      </Menu>
    </>
  )
}

export default AssignUser
