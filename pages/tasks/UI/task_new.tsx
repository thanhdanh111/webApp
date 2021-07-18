import { Box, Button, InputBase } from '@material-ui/core'
import React, { useEffect } from 'react'
import CloseIcon from '@material-ui/icons/Close'
import Tooltip from '@material-ui/core/Tooltip'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import Panel from './panel_task'
import AssignUser from './assign_user'
import DirectNewTask from './direct_new_task'
import { setAssigned, setTempararyTask } from '../logic/task_action'
import { createdTaskThunkAction, TaskType } from '../logic/task_reducer'
import { setCurrentStatus } from 'pages/task_statuses/logic/task_statuses_action'
import { checkIfEmptyArray } from 'helpers/check_if_empty_array'
import { UserInfoType } from 'helpers/type'

interface InitProps {
  taskStatusID: string
}

const TaskNew: React.FC<InitProps> = (props) => {
  const dispatch = useDispatch()
  const { userID, profile }: UserInfoType = useSelector((state: RootStateOrAny) => state.userInfo)
  const { temporaryAssigned, temporaryTask }: TaskType = useSelector((state: RootStateOrAny) => state.tasks)

  useEffect(() => {

    if (checkIfEmptyArray(temporaryAssigned)) {
      return
    }

    const assignDefault = {
      _id: userID,
      profilePhoto: profile?.profilePhoto,
      fullName: `${profile?.firstName} ${profile?.lastName}`,
    }

    dispatch(setAssigned([...temporaryAssigned, assignDefault]))
  }, [])

  const handleAssign = (users) => {
    dispatch(setAssigned(users))
  }

  const onChangeTitle = (event) => {
    dispatch(setTempararyTask({ ...temporaryTask, title: event.target.value }))

    if (event.keyCode !== 13) {
      return
    }
    addNewTask()
  }

  const addNewTask = () => {
    if (!temporaryTask?.title) {
      return
    }

    const temp = {
      ...temporaryTask,
      taskStatusID: props.taskStatusID,
      userIDs: temporaryAssigned?.map((user) => user._id),
    }

    dispatch(createdTaskThunkAction(temp))
  }

  const handleClose = async () => {
    await Promise.all([
      dispatch(setCurrentStatus('')),
      dispatch(setAssigned(''))],
    )
  }

  return (
    <Box className='task-add' position='relative'>
      <Box display='flex' flexDirection='row' alignItems='center'>
        <CloseIcon onClick={handleClose} className='icon-add close-icon'/>
        <InputBase
          placeholder="Task name or type '/' for commands"
          name='title'
          onKeyUp={onChangeTitle}
        />
        <AssignUser usersAssigned={temporaryAssigned} handleAssign={handleAssign} sizes='assigned-user-avatar'/>
      </Box>
      <Box display='flex' px={2} pb={'10px'} mt={'25px'} fontWeight={100}>
        <Panel/>
      </Box>
      <Box position='absolute' bottom={10} right={10}>
        <Tooltip
          title={
            temporaryTask?.title
              ? 'Press enter to save (ctrl+enter to open)'
              : 'Please type a task name'
          }
          arrow={true}
          placement='top'
        >
          <Button
            className='save-add'
            variant='contained'
            size='small'
            color='primary'
            onClick={() => addNewTask()}
          >
            Save
          </Button>
        </Tooltip>
      </Box>
      <DirectNewTask/>
    </Box>
  )
}

export default TaskNew
