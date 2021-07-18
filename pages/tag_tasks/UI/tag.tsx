import {
  Box,
  List,
  ListItem,
  Popover,
} from '@material-ui/core'
import React, { useState } from 'react'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import CloseIcon from '@material-ui/icons/Close'
import { Tag } from 'helpers/type'
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state'
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import { useDispatch } from 'react-redux'
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined'
import { ConfirmDialog } from '@components/confirm_dialog/confirm_dialog'
import AddTagPopup from './add_tag'
import { deleteTagThunkAction, updateTagThunkAction } from '../logic/tag_tasks_reducer'

interface InitialProp {
  selectedTag: Tag[]
  getSelectedTag: (tag) => void
}

const TagTask: React.FC<InitialProp> = (props) => {
  return (
    <Box display='flex' ml={4} my='5px'>
      <ElementsTag selectedTag={props.selectedTag} getSelectedTag={(tags) => props.getSelectedTag(tags)}>
        <AddTagPopup
           selectedTag={props.selectedTag}
           getSelectedTag={(tags) => props.getSelectedTag(tags)}
           showSelectedTag={true}
           isCreateTag={true}
        >
           <LocalOfferOutlinedIcon
             key='click-popup'
             className='border-dashed-icon tag-icon'
           />
        </AddTagPopup>
      </ElementsTag>
    </Box>
  )
}

interface InitialPropTag {
  tag: Tag
  removeTag: () => void
}

export const TagItem: React.FC<InitialPropTag> = (props) => {
  const dispatch = useDispatch()
  const [changeNameTag, setChangeNameTag] = useState({ isChange: false, value: '' })

  const onKeyUpNameTag = (event) => {
    if (event.keyCode !== 13){
      return
    }
    changeName()
  }

  const changeName = () => {
    if (!changeNameTag.value){
      return
    }
    dispatch(updateTagThunkAction(props.tag._id, { name: changeNameTag.value }))
    setChangeNameTag({ ...changeNameTag, isChange: false })
  }

  return (
    <Box className='tag-item' m='4px'>
      <div
        className='background-opacity'
        style={{
          backgroundColor: props.tag.color,
          opacity: 0.2,
        }}
      />
      <span className='tag-text' style={{ color: props.tag.color }}>{props.tag.name}</span>
      {changeNameTag.isChange && (
        <input
          defaultValue={props.tag.name}
          id='input-tag-name'
          className='input-name-tag'
          value={changeNameTag.value}
          onChange={(event) => setChangeNameTag({ ...changeNameTag, value: event.target.value })}
          onBlur={() => changeName()}
          onKeyUp={(event) => onKeyUpNameTag(event)}
        />
      )}
      <div className='icon-tag' style={{ color: props.tag.color }}>
        <TagMoreAction
          changeName={() => setChangeNameTag({ value: props.tag.name, isChange: true })}
          onDeleteTag={() => dispatch(deleteTagThunkAction(props.tag?._id))}
        />
        <CloseIcon
          className='icon-item delete'
          style={{ backgroundColor: props.tag.color }}
          onClick={() => props.removeTag()}
        />
      </div>
    </Box>
  )
}

export default TagTask

interface InitialPropMoreAction {
  changeName: () => void
  onDeleteTag: () => void
}

export const TagMoreAction: React.FC<InitialPropMoreAction> = (props) => {
  const [deleteTag, setDeleteTag] = useState(false)

  const renderActionForTag = (popupState) => (
    <List component='nav' className='tag-action-popup'>
      <ListItem button className='delete-tag' onClick={() => { popupState.close(); setDeleteTag(true) }}>
          <DeleteOutlineOutlinedIcon className='icon-tag-action' color='error'/>
          Delete
      </ListItem>
      <label htmlFor='input-tag-name'>
      <ListItem button onClick={() => { props.changeName(); popupState.close() }}>
          <EditOutlinedIcon className='icon-tag-action'/>
            Rename
      </ListItem>
      </label>
    </List>
  )

  return (
    <>
    <PopupState variant='popover' popupId='demo-popup-menu'>
      {(popupState) => (
        <>
          <MoreHorizIcon className='more-item-icon' {...bindTrigger(popupState)}/>
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
  )
}
interface InitialPropElements {
  selectedTag: Tag[]
  getSelectedTag: (tag) => void
}

export const ElementsTag: React.FC<InitialPropElements> = (props) => {
  const removeTag = (tag) => {
    const tags = props.selectedTag.filter((tagItem) => tagItem._id !== tag._id)
    props.getSelectedTag(tags)
  }

  return (
    <Box display='flex' width='auto' alignItems='center' pr='12px' flexWrap='wrap'>
    {
     props.selectedTag?.map((tag) => (
        <TagItem key={tag._id} tag={tag} removeTag={() => removeTag(tag)}/>
      ))
    }
    {props.children}
    </Box>
  )
}
