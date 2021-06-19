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
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { setSelectedTaskBoard } from 'pages/home/logic/home_actions';
import { createTaskBoardThunkAction, getTaskBoardThunkAction, HomeDataType } from 'pages/home/logic/home_reducer';
import { Close } from '@material-ui/icons';
import { checkArray } from 'helpers/check_array';

const TaskBoardUI = () => {
  const dispatch = useDispatch();
  const {
    taskBoards,
    selectTaskBoardID,
    hasNoData,
    loading,
  }: HomeDataType = useSelector((state: RootStateOrAny) => state.taskStatuses);
  const [open, setOpen] = useState(false);
  const [titleTaskBoard, setTileTaskBoard] = useState('');
  const [descriptionTaskBoard, setDescriptionTaskBoard] = useState('');

  const classRequire = !titleTaskBoard ? 'title-required' : '';

  useEffect(() => {
    void fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([
      dispatch(getTaskBoardThunkAction()),
    ]);
  };

  const changeTaskBoard = (event) => {
    if (event.target.value === selectTaskBoardID) {
      return;
    }

    dispatch(setSelectedTaskBoard(event.target.value));
  };

  const handleOpenOrClose = () => {
    setOpen(!open);
  };

  const handleChangeTitleTaskBoard = (event) => {
    setTileTaskBoard(event?.target?.value);
  };

  const handleChangeDescriptionTaskBoard = (event) => {
    setDescriptionTaskBoard(event?.target?.value);
  };

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
    );
  };

  const onSubmitCreateTaskBoard = () => {
    dispatch(createTaskBoardThunkAction(titleTaskBoard, descriptionTaskBoard));
  };

  const modalCreatedTaskBoard = () => {
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
    );
  };

  return (
    <div className='nav-click-up-task-board'>
      <IconButton className='add-task-board' aria-label='light mode' color='inherit' onClick={handleOpenOrClose}>
        <ViewModuleIcon className='nav-click-up-task-board-icon' />
      </IconButton>
      {modalCreatedTaskBoard()}
      <Select
          value={selectTaskBoardID}
          onChange={changeTaskBoard}
          className='nav-click-up-task-board-select'
      >
        {(checkArray(taskBoards) && !hasNoData) ? taskBoards.map((item, index) => {
          return (
            <MenuItem
              key={item?._id ?? index}
              className='item'
              value={item?._id}
            >
              {item?.title}
            </MenuItem>
          );
        }) :
        <div className='empty-state'>
          <img alt='logo' width='100px' src='../document.svg'/>
          <Typography color='textSecondary' className='empty-state--text'>Not found any TaskBoards</Typography>
        </div>
      }
      </Select>
    </div>
  );

};

export default TaskBoardUI;
