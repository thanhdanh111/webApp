import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import ViewModuleIcon from '@material-ui/icons/ViewModule'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedTaskBoard } from '../logic/task_boards_action'
import { createTaskBoardThunkAction, getTaskBoardThunkAction, TaskBoardsType } from '../logic/task_boards_reducer'
import { Close } from '@material-ui/icons'
import { Roles } from 'constants/roles'
import { RootState } from 'redux/reducers_registration'
import { UserInfoType } from 'helpers/type'
import { checkValidAccess } from 'helpers/check_valid_access'
import { getPaginationThunkAction } from 'pages/users/logic/users_reducer'
import { resetTasksByCurrentTaskBoar } from 'pages/tasks/logic/task_action'

const validAccesses = [Roles.COMPANY_MANAGER, Roles.DEPARTMENT_MANAGER]

const TaskBoardUI = () => {
  const dispatch = useDispatch()
  const { taskBoards, currentTaskBoard, loading }: TaskBoardsType = useSelector((state: RootState) => state.taskBoards)
  const {
    isAdmin,
    rolesInCompany,
  }: UserInfoType =  useSelector((state: RootState) => state?.userInfo)
  const checkUserScope = isAdmin || checkValidAccess({ rolesInCompany, validAccesses })
  const [open, setOpen] = useState(false)
  const [titleTaskBoard, setTileTaskBoard] = useState('')
  const [descriptionTaskBoard, setDescriptionTaskBoard] = useState('')
  const classRequire = !titleTaskBoard ? 'title-required' : ''
  const taskBoardsArray = Object.values(taskBoards)

  useEffect(() => {
    void fetchData()
  }, [])

  const fetchData = async () => {
    await Promise.all([
      dispatch(getTaskBoardThunkAction()),
      dispatch(getPaginationThunkAction()),
    ])
  }

  const changeSelectedTaskBoard = async (event) => {
    if (event.target.value === currentTaskBoard._id) {
      return
    }

    const taskBoard = taskBoards[event?.target?.value ?? '']

    if (taskBoard) {
      await Promise.all([
        dispatch(resetTasksByCurrentTaskBoar()),
        dispatch(setSelectedTaskBoard(taskBoard)),
      ])
    }

    dispatch(setSelectedTaskBoard(taskBoard))
  }

  const handleOpenOrClose = () => {
    setOpen(!open)
  }

  const handleChangeTitleTaskBoard = (event) => {
    setTileTaskBoard(event?.target?.value)
  }

  const handleChangeDescriptionTaskBoard = (event) => {
    setDescriptionTaskBoard(event?.target?.value)
  }

  const generateUIContentCreatTaskBoard = () => {
    return (
      <div>
        <Box className={`title-task-board-create ${classRequire}`} >
          <form noValidate autoComplete='off' className='text-field-form' >
            <TextField
              color='secondary'
              rows={12}
              className='text-field'
              label='Title'
              variant='outlined'
              fullWidth
              onChange={handleChangeTitleTaskBoard}
            />
          </form>
        </Box>
        <Box className='description-task-board-create'>
          <form noValidate autoComplete='off' className='text-field-form' >
            <TextField
              color='secondary'
              rows={12}
              multiline
              className='text-field'
              label='Description'
              fullWidth
              onChange={handleChangeDescriptionTaskBoard}
              variant='outlined'
            />
          </form>
        </Box>
      </div>
    )
  }

  const onSubmitCreateTaskBoard = () => {
    if (!checkUserScope) {
      return
    }

    dispatch(createTaskBoardThunkAction(titleTaskBoard, descriptionTaskBoard))
  }

  const creatTaskBoardModal = () => {
    return (
      <Dialog
        className='add-task-board-dialog'
        fullWidth
        maxWidth='md'
        open={open}
        onClose={handleOpenOrClose}
      >
        <IconButton className='dialog-close-button' onClick={handleOpenOrClose}>
          <Close />
        </IconButton>
        <DialogContent>
        <div className='request-dialog-content'>
          <Typography component='h3' variant='h5' className='request-dialog-content--title'>
              Add TaskBoard To Company
          </Typography>
          {generateUIContentCreatTaskBoard()}
        </div>

          <Button
            size='large'
            type='submit'
            fullWidth
            variant='contained'
            color='secondary'
            className='dialog--submit-btn'
            onClick={onSubmitCreateTaskBoard}
          >
            {loading ? 'Create TaskBoard...' : 'Submit'}
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className='nav-click-up-task-board'>
      <IconButton
        className='add-task-board btn-add-task-board'
        aria-label='light mode'
        color='inherit'
        onClick={handleOpenOrClose}
      >
        <ViewModuleIcon className='nav-click-up-task-board-icon' />
      </IconButton>
      {creatTaskBoardModal()}
      <Select
        disableUnderline
        value={currentTaskBoard?._id}
        onChange={changeSelectedTaskBoard}
        className='nav-click-up-task-board-select'
      >
        {taskBoardsArray?.length ? taskBoardsArray.map((item, index) => {
          return (
            <MenuItem
              title={item?.title}
              key={item?._id ?? index}
              className='item'
              value={item?._id}
              classes={{
                selected: 'nav-click-up-task-board-select--item-selected',
              }}
            >
              {item?.title}
            </MenuItem>
          )
        }) :
        <MenuItem>
          None
        </MenuItem>
      }
      </Select>
    </div>
  )

}

export default TaskBoardUI
