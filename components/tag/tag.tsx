import {
  Box,
  Grid,
  List,
  ListItem,
  Popover,
} from '@material-ui/core';
import React, { useState } from 'react';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import CloseIcon from '@material-ui/icons/Close';
import { Tag } from 'helpers/type';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import PaletteOutlinedIcon from '@material-ui/icons/PaletteOutlined';
import ColorizeIcon from '@material-ui/icons/Colorize';
import DoneOutlinedIcon from '@material-ui/icons/DoneOutlined';
import { useDispatch } from 'react-redux';
import { deleteTagThunkAction } from 'pages/task_boards/logic/task_boards_reducer';
import { ConfirmDialog } from '@components/confirm_dialog/confirm_dialog';
import AddTagPopup from './add_tag';

interface InitialPropTag {
  tag: Tag;
}

export const colorDefault = ['#81200E', '#F57829', '#F15381', '#F27DAA', '#EC73EA',
  '#C26DEC', '#816CFA', '#05A9F4', '#2760E8', '#82B0FB', '#F57829', '#61CE6F',
  '#F9DA38', '#667684'];

const TagTask: React.FC = () => {
  return (
    <Box display='flex' ml={4} my='5px'>
      <Grid container spacing={1} alignItems='center'>
        <Grid item>
          <TagItem tag={{ name: 'Snt-app' }} />
        </Grid>
        <AddTagPopup/>
      </Grid>
    </Box>
  );
};

export const TagItem: React.FC<InitialPropTag> = (props) => {
  const [isChangeName, setIsChangeName] = useState(false);
  const dispatch = useDispatch();

  return (
    <div
      className='tag-item'
      style={{
        backgroundColor: 'rgba(2, 49, 232, 0.2)',
        color: 'rgb(2, 49, 232)',
      }}
    >
      <span className='tag-text'>{props.tag.name}</span>
      {isChangeName && (
        <input
          defaultValue={props.tag.name}
          id='input-tag-name'
          className='input-name-tag'
          onBlur={() => setIsChangeName(false)}
        />
      )}
      <div className='icon-tag'>
        <TagMoreAction
          changeName={() => setIsChangeName(true)}
          onDeleteTag={() => dispatch(deleteTagThunkAction(props.tag?._id))}
        />
        <CloseIcon
          className='icon-item delete'
          style={{ backgroundColor: 'rgb(2, 49, 232)' }}
        />
      </div>
    </div>
  );
};

export default TagTask;

interface InitialPropMoreAction {
  changeName: () => void;
  onDeleteTag: () => void;
}

export const TagMoreAction: React.FC<InitialPropMoreAction> = (props) => {
  const [deleteTag, setDeleteTag] = useState(false);

  const renderActionForTag = (popupState) => (
    <List component='nav' className='tag-action-popup'>
      <ListItem button className='delete-tag' onClick={() => { popupState.close(); setDeleteTag(true); }}>
          <DeleteOutlineOutlinedIcon className='icon-tag-action' color='error'/>
          Delete
      </ListItem>
      <label htmlFor='input-tag-name'>
      <ListItem button onClick={() => { props.changeName(); popupState.close(); }}>
          <EditOutlinedIcon className='icon-tag-action'/>
            Rename
      </ListItem>
      </label>
      <ChangeColor/>
    </List>
  );

  return (
    <>
    <PopupState variant='popover' popupId='demo-popup-menu'>
      {(popupState) => (
        <>
          <MoreHorizIcon className='more-item-icon' {...bindTrigger(popupState)} />
          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            {renderActionForTag(popupState)}
          </Popover>
        </>
      )}
    </PopupState>
    <ConfirmDialog
        loading={false}
        onOpen={deleteTag}
        status='REMOVE'
        handleClose={() => setDeleteTag(false)}
        handleNo={() => setDeleteTag(false)}
        handleYes={props.onDeleteTag}
        title='Delete Tag'
        warning='Do you want to delete this tag ?'
    />
    </>
  );
};

const ChangeColor: React.FC = () => {

  const renderColor = () => {
    colorDefault.map((color, key) => (
      <div className='color-item active' key={key} style={{ backgroundColor : color }}>
        <DoneOutlinedIcon className='color-checked'/>
      </div>
    ));
  };

  return (
    <PopupState variant='popover' popupId='demo-popup-menu'>
  {(popupState) => (
    <>
    <ListItem button {...bindTrigger(popupState)}>
      <PaletteOutlinedIcon className='icon-tag-action'/>
      Change color
    </ListItem>
    <Popover
      {...bindPopover(popupState)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      className='change-color-popup'
    >
      <Box className='change-color' display='flex' flexWrap='wrap'>
        {renderColor()}
        <div className='color-picker'>
          <label htmlFor='color-picker'><ColorizeIcon/></label>
          <input type='color' id='input-color-picker'/>
        </div>
      </Box>
    </Popover>
    </>
     )}
    </PopupState>
  );
};
