import { Box, Button, Menu, MenuItem } from '@material-ui/core'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted'
import ViewModuleIcon from '@material-ui/icons/ViewModule'
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state'
import AttachFileOutlinedIcon from '@material-ui/icons/AttachFileOutlined'
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined'
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined'
import ArchiveIcon from '@material-ui/icons/Archive'
import FilterDramaIcon from '@material-ui/icons/FilterDrama'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import CloudUploadOutlinedIcon from '@material-ui/icons/CloudUploadOutlined'

const attachmentOption = [
  {
    id: '',
    icon: <AttachFileOutlinedIcon className='icon-option'/>,
    title: 'Upload file',
  },
  {
    id: '',
    icon: <DescriptionOutlinedIcon className='icon-option'/>,
    title: 'New Doc',
  },
  {
    id: '',
    icon: <ArchiveIcon className='icon-option'/>,
    title: 'Dropbox',
  },
  {
    id: '',
    icon: <FilterDramaIcon className='icon-option'/>,
    title: 'OneDrive/Sharepoint',
  },
  {
    id: '',
    icon: <FolderOpenIcon className='icon-option'/>,
    title: 'Box',
  },
  {
    id: '',
    icon: <InsertDriveFileOutlinedIcon className='icon-option'/>,
    title: 'Google Drive',
  },
  {
    id: '',
    icon: <InsertDriveFileOutlinedIcon className='icon-option'/>,
    title: 'New Google Doc',
  },

]

const AttachmentInBody: React.FC = () => {
  const renderMenuOption = (popupState) => (
    <Menu
      {...bindMenu(popupState)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      className='attachment-detail-popup'
    > {
        attachmentOption.map((option) => (
          <MenuItem className='option-attachment' key={option.id}>{option.icon} {option.title}</MenuItem>
        ))
      }
    </Menu>
  )

  return (
    <Box px={4} display='flex' justifyContent='space-between' alignItems='center'>
      <Box>
      <span className='attachments-title'>Attachments</span>
      <PopupState variant='popover' popupId='demo-popup-popover'>
        {(popupState) => (
          <>
            <Button variant='outlined' className='btn-add-attachment' {...bindTrigger(popupState)} >
              Add
              <ArrowDropDownIcon className='icon-attachment'/>
            </Button>
            {renderMenuOption(popupState)}
          </>
      )}
      </PopupState>
      </Box>
      <Box display='flex' alignItems='center'>
        <ViewModuleIcon className='veiw-attachment active'/>
        <FormatListBulletedIcon className='veiw-attachment'/>
      </Box>
    </Box>
  )
}

export default AttachmentInBody

export const AttachmentInFooter: React.FC = () => {
  return (
    <Box width='50%'>
      <Box className='uploader-file' display='flex' alignItems='center' justifyContent='center'>
        <CloudUploadOutlinedIcon/>
        <span className='text-upload'>Drop files here to attach or </span>
       <label className='label-upload' htmlFor='attachment-upload'>browse</label>
       <input type='file' className='attachment-browse' id='attachment-upload' />
      </Box>
    </Box>
  )
}
