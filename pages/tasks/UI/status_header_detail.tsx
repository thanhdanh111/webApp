import { Box, Button } from '@material-ui/core'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import AssignUser from './assign_user'
import OutlinedFlagIcon from '@material-ui/icons/OutlinedFlag'
import DoneIcon from '@material-ui/icons/Done'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import { TaskType, updateAssignUserThunkAction } from '../logic/task_reducer'
import { User } from 'helpers/type'

const StatusDetail = () => {
  const { currentTask }: TaskType = useSelector((state: RootStateOrAny) => state.tasks)

  const dispatch = useDispatch()

  const getAssignUser = (users) => {
    const userAssigns = users?.map((each) => each?._id)

    dispatch(updateAssignUserThunkAction(currentTask._id, userAssigns))
  }

  return (
    <Box display='flex' alignItems='center' alignContent='center' py='15px' pl={4} className='status-modal'>
      <Box display='flex' height='30px' className='status-detail'>
        <button className='btn-status'>STATUS</button>
        <button className='btn-status'><ArrowRightIcon/></button>
      </Box>
      <Button variant='outlined' color='primary' className='btn-detail done-detail'>
         <DoneIcon className='icon-detail done-icon'/>
      </Button>
      <AssignUser usersAssigned={currentTask?.userIDs as User[]} handleAssign={getAssignUser} sizes='assigned-user-avatar'/>
      <Box className='priority-detail' display='flex' alignItems='center'>
        <OutlinedFlagIcon className='tag-border priority-icon'/>
      </Box>
    </Box>
  )
}

export default StatusDetail
