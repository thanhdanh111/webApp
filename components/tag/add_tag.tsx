import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined';
import { pushNewNotifications } from 'redux/common/notifications/reducer';
import { randomArray } from '../../helpers/random_array';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { createTagThunkAction, deleteTagThunkAction } from 'pages/task_boards/logic/task_boards_reducer';
import React, { useState } from 'react';
import { Tag } from 'helpers/type';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';
import { Box, Grid, InputBase, List, ListItem, Popover } from '@material-ui/core';
import { colorDefault, TagItem, TagMoreAction } from './tag';

const AddTagPopup: React.FC = () => {
  const dispatch = useDispatch();
  const [tagChangeName, setTaskChangeName] = useState('');
  const [newTag, setNewTag] = useState<Tag>({ name: '' });
  const tags = useSelector((state: RootStateOrAny) => state.taskBoards?.tags);

  const onKeyUpTagName = (event) => {
    if (event.keyCode !== 13) {
      return;
    }

    if (!newTag.name) {
      dispatch(pushNewNotifications({ variant: 'error', message: 'name should not be empty' }));

      return;
    }
    dispatch(createTagThunkAction({ ...newTag, color: randomArray(colorDefault) }));
    setNewTag({ name: '' });
  };

  return (
    <PopupState variant='popover' popupId='demo-popup-menu'>
      {(popupState) => (
        <>
          <Grid item className='tag-add' {...bindTrigger(popupState)}>
            <LocalOfferOutlinedIcon className='tag-border tag-icon' />
          </Grid>
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
            <Box
              display='flex'
              flexDirection='column'
              className='add-tag-popup'
            >
              <Grid
                container
                spacing={1}
                alignItems='center'
                className='tags-selected'
              >
                <Grid item>
                  <TagItem tag={{ name: 'Snt-app' }} />
                </Grid>
              </Grid>
              <Box px={1} className='search-tag'>
                <InputBase
                  placeholder='Search or Create New'
                  onKeyUp={onKeyUpTagName}
                  onChange={(event) => setNewTag({ ...newTag, name: event.target.value })}
                  value={newTag.name}
                />
              </Box>
              <Box px={1}>
                <List component='nav' className='tag-list'>
                  {tags?.map((tag) => (
                    <ListItem
                      key={tag?._id}
                      className='tag-item-list'
                      style={{ color: tag.color }}
                    >
                      <span>{tag.name}</span>
                      {tagChangeName === tag?._id && (
                        <input className='input-name-tag' />
                      )}
                      <TagMoreAction
                        changeName={() => setTaskChangeName(tag?._id)}
                        onDeleteTag={() => dispatch(deleteTagThunkAction(tag?._id))}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          </Popover>
        </>
      )}
    </PopupState>
  );
};

export default AddTagPopup;
