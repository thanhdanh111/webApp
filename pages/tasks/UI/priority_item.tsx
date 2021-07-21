import { Box, MenuItem } from '@material-ui/core'
import React from 'react'
import CloseIcon from '@material-ui/icons/Close'
import OutlinedFlagIcon from '@material-ui/icons/OutlinedFlag'
interface PriorityLevel {
  text: string
  color: string
  value: string
}
interface InitProps {
  priorityLevel: PriorityLevel
  changePriority: () => void
}
const PriorityItem: React.FC<InitProps> = (props) => {

  return (
    <MenuItem
     onClick={() => props.changePriority()}
     className={`priority-${props.priorityLevel.text}`}
    >
     <Box display='flex' alignItems='center'>
       {props.priorityLevel.value === '' ? (
         <CloseIcon
           fontSize='small'
           className='icon-popup'
           style={{ color: props.priorityLevel.color }}
         />
       ) : (
         <OutlinedFlagIcon
           fontSize='small'
           className='icon-popup'
           style={{ color: props.priorityLevel.color }}
         />
       )}
       {props.priorityLevel.text}
     </Box>
    </MenuItem>
  )
}

export default PriorityItem
