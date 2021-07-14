import { pushNewNotifications } from 'redux/common/notifications/reducer';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { createTagThunkAction, deleteTagThunkAction, getTagsThunkAction, updateTagThunkAction } from 'pages/task_boards/logic/task_boards_reducer';
import React, { useEffect, useState } from 'react';
import { Tag } from 'helpers/type';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';
import { Box, Button, Grid, InputBase, List, ListItem, Popover } from '@material-ui/core';
import { ElementsTag, TagMoreAction } from './tag';
import { useDebounce } from 'helpers/debounce';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DisappearedLoading } from 'react-loadingg';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { checkHasObjectByKey } from 'helpers/check_in_array';

interface InitialPropTag {
  selectedTag: Tag[];
  getSelectedTag: (tags) => void;
  showSelectedTag?: boolean;
  isCreateTag?: boolean;
}

const AddTagPopup: React.FC<InitialPropTag> = (props) => {
  const dispatch = useDispatch();
  const [tagChangeName, setTagChangeName] = useState('');
  const [inputNameTag, setInputNameTag] = useState('');
  const { tags, totalCountTag } : {tags: Tag[], totalCountTag: number} = useSelector((state: RootStateOrAny) => state.taskBoards);
  const [nameTag, setNameTag] = useState('');
  const debouncedSearchTerm = useDebounce(inputNameTag, 200);

  useEffect(() => {
    dispatch(getTagsThunkAction(debouncedSearchTerm, true));
  }, [debouncedSearchTerm]);

  const getUser = () => {
    dispatch(getTagsThunkAction(debouncedSearchTerm, false));
  };

  const onBlurChangeNameTag = (tag) => {
    dispatch(updateTagThunkAction(tag._id, { name: nameTag }));
    setTagChangeName('');
  };

  const onKeyUpChangeNameTag = (event, tag) => {
    if (event.keyCode !== 13 || (event.keyCode === 13 && !nameTag)){
      return;
    }

    dispatch(updateTagThunkAction(tag._id, { name: nameTag }));
    setTagChangeName('');
  };

  const onKeyUpTagName = (event) => {
    if (event.keyCode !== 13) {
      return;
    }

    if (!inputNameTag) {
      dispatch(pushNewNotifications({ variant: 'error', message: 'name should not be empty' }));

      return;
    }
    addTag();
  };

  const addTag = () => {
    if (!props.isCreateTag){
      return;
    }
    dispatch(createTagThunkAction({ name: inputNameTag }));
    setInputNameTag('');
  };

  const renderListTag = () => {
    if (!tags.length){
      if (!props.isCreateTag) {
        return (<ListItem className='tag-item-list'>
          No result!
        </ListItem>);
      }

      return (
        <ListItem className='tag-item-list add-tag'>
          <p>Click here to create a new tag</p>
          <Button variant='contained' color='primary' onClick={addTag} className='btn-add-tag'>
            <AddOutlinedIcon className='icon-add-tag'/>
          </Button>
        </ListItem>);
    }
    const notSeletedTag = tags.filter((tag: Tag) => !checkHasObjectByKey(props.selectedTag, tag?._id || '', '_id'));

    if (!notSeletedTag.length){
      return (
        <ListItem className='tag-item-list'>
          Tag already attached
        </ListItem>);
    }

    const listTag = notSeletedTag?.map((tag) => {
      return(
        <ListItem
          key={tag?._id}
          className='tag-item-list'
          style={{ color: tag.color }}
        >
        <span onClick={() => { props.getSelectedTag([...props.selectedTag, tag]); }}>{tag.name}</span>
        {tagChangeName === tag?._id && (
          <input
            className='input-name-tag'
            value={nameTag}
            onChange={(event) => setNameTag(event.target.value)}
            onBlur={() => onBlurChangeNameTag(tag)}
            onKeyUp={(event) => onKeyUpChangeNameTag(event, tag)}
          />
        )}
        <TagMoreAction
          changeName={() => { setTagChangeName(tag?._id || ''); setNameTag(tag.name); }}
          onDeleteTag={() => dispatch(deleteTagThunkAction(tag?._id))}
        />
        </ListItem>
      );
    });

    return listTag;
  };

  const renderSearchInput = () => (
    <Box px={1} className='search-tag'>
    <InputBase
      placeholder='Search or Create New'
      onKeyUp={onKeyUpTagName}
      onChange={(event) => setInputNameTag(event.target.value)}
      value={inputNameTag}
      className='input-search-tag'
    />
  </Box>
  );

  return (
    <PopupState variant='popover' popupId='demo-popup-menu'>
      {(popupState) => (
        <>
          <Grid item className='tag-add' {...bindTrigger(popupState)}>
            {props.children}
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
              {props.showSelectedTag && (
                <Box p={1}>
                  <ElementsTag
                    selectedTag={props.selectedTag}
                    getSelectedTag={(selectedtag) =>
                      props.getSelectedTag(selectedtag)
                    }
                  />
                </Box>
              )}
              {renderSearchInput()}
              <Box px={1}>
                <List component='nav' className='tag-list'>
                <InfiniteScroll
                  dataLength={tags.length}
                  hasMore={tags.length < totalCountTag}
                  next={getUser}
                  loader={<DisappearedLoading color={'#67cb48'} />}
                  scrollThreshold={0.8}
                  height={200}
                >
                  {renderListTag()}
                </InfiniteScroll>
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
