import { pushNewNotifications } from 'redux/common/notifications/reducer'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { Tag } from 'helpers/type'
import { Box, Grid, InputBase, List, ListItem, Popper } from '@material-ui/core'
import { ElementsTag, TagMoreAction } from './tag'
import { useDebounce } from 'helpers/debounce'
import InfiniteScroll from 'react-infinite-scroll-component'
import { DisappearedLoading } from 'react-loadingg'
import { checkArrayObjectHasObjectByKey } from 'helpers/check_in_array'
import AddIcon from '@material-ui/icons/Add'
import { createTagThunkAction, deleteTagThunkAction, getTagsThunkAction, updateTagThunkAction } from '../logic/tag_tasks_reducer'

interface InitialPropTag {
  selectedTag: Tag[]
  getSelectedTag: (tags) => void
  showSelectedTag?: boolean
  isCreateTag?: boolean
}

const AddTagPopup: React.FC<InitialPropTag> = (props) => {
  const dispatch = useDispatch()
  const [tagChangeName, setTagChangeName] = useState('')
  const [inputNameTag, setInputNameTag] = useState('')
  const {
    tags,
    totalCount,
    cursor,
  }: { tags: {[key: string]: Tag}; totalCount: number; cursor: string } = useSelector(
    (state: RootStateOrAny) => state.tagTasks)
  const [nameTag, setNameTag] = useState('')
  const debouncedSearchTerm = useDebounce(inputNameTag, 500)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const id = !!anchorEl ? 'simple-popper' : undefined

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  useEffect(() => {
    dispatch(getTagsThunkAction(debouncedSearchTerm, true))
  }, [debouncedSearchTerm])

  const getData = () => {
    dispatch(getTagsThunkAction(debouncedSearchTerm, false))
  }

  const onBlurChangeNameTag = (tag) => {
    dispatch(updateTagThunkAction(tag._id, { name: nameTag }))
    setTagChangeName('')
  }

  const onKeyUpChangeNameTag = (event, tag) => {
    if (event.keyCode !== 13 || !nameTag){
      return
    }

    dispatch(updateTagThunkAction(tag._id, { name: nameTag }))
    setTagChangeName('')
  }

  const onKeyUpTagName = (event) => {
    if (event.keyCode !== 13) {
      return
    }

    addTag()
  }

  const addTag = () => {
    if (!props.isCreateTag){
      return
    }

    if (!inputNameTag) {
      dispatch(pushNewNotifications({ variant: 'error', message: 'name should not be empty' }))

      return
    }

    if (checkArrayObjectHasObjectByKey(Object.values(tags), inputNameTag, 'name')){
      dispatch(pushNewNotifications({ variant: 'error', message: 'Tag already exists' }))

      return
    }

    dispatch(createTagThunkAction({ name: inputNameTag }))
    setInputNameTag('')
  }

  const renderListTag = () => {
    if (!Object.keys(tags)?.length){
      return (<ListItem className='tag-item-list'>
      No tag!
    </ListItem>)
    }

    const notSeletedTag = Object.values(tags).filter((tag: Tag) => !checkArrayObjectHasObjectByKey(props.selectedTag, tag?._id || '', '_id'))

    if (notSeletedTag.length < 5){
      if (cursor !== 'END'){
        getData()

        return
      }
      if (notSeletedTag.length === 0){
        return (
          <ListItem className='tag-item-list'>
            No tag
          </ListItem>)
      }
    }

    const listTag = notSeletedTag?.map((tag) => {
      return(
        <ListItem
          key={tag?._id}
          className='tag-item-list'
          style={{ color: tag.color }}
        >
        <span onClick={() => { props.getSelectedTag([...props.selectedTag, tag]) }}>{tag.name}</span>
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
          changeName={() => { setTagChangeName(tag?._id || ''); setNameTag(tag.name) }}
          onDeleteTag={() => dispatch(deleteTagThunkAction(tag?._id))}
        />
        </ListItem>
      )
    })

    return listTag
  }

  const renderSearchInput = () => (
    <Box px={1} className='search-tag'>
    <InputBase
      placeholder='Search or Create New'
      onKeyUp={onKeyUpTagName}
      onChange={(event) => setInputNameTag(event.target.value)}
      value={inputNameTag}
      className='input-search-tag'
    />
    {
      props.isCreateTag && (<AddIcon className='add-icon-tag' onClick={() => addTag()}/>)
    }
  </Box>
  )

  const renderElementTags = () => {
    if (!props.showSelectedTag || !props.selectedTag?.length){
      return
    }

    return (
      <Box p={1} maxHeight='60px' maxWidth='300px' overflow='auto'>
        <ElementsTag
          selectedTag={props.selectedTag}
          getSelectedTag={(selectedtag) =>
            props.getSelectedTag(selectedtag)
          }
        />
      </Box>)
  }

  return (
        <>
          <Grid item className='tag-add' onClick={handleClick} aria-describedby={id}>
            {props.children}
          </Grid>
          {!!anchorEl && <div className='popup-tag-close' onClick={() => setAnchorEl(null)}/>}
          <Popper
            id={id}
            open={!!anchorEl}
            anchorEl={anchorEl}
            className='popup-tag'
            placement='bottom-start'
          >
            <Box
              display='flex'
              flexDirection='column'
              className='add-tag-popup'
            >
              {renderElementTags()}
              {renderSearchInput()}
              <Box px={1}>
                <List component='nav' className='tag-list'>
                <InfiniteScroll
                  dataLength={Object.values(tags)?.length}
                  hasMore={Object.values(tags).length < totalCount}
                  next={getData}
                  loader={<DisappearedLoading color={'#67cb48'} />}
                  scrollThreshold={0.8}
                  height={200}
                >
                  {renderListTag()}
                </InfiniteScroll>
                </List>
              </Box>
            </Box>
          </Popper>
        </>
  )
}

export default AddTagPopup
