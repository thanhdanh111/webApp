import { Menu, Tooltip } from '@material-ui/core'
import React from 'react'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'
import OutlinedFlagIcon from '@material-ui/icons/OutlinedFlag'
import { RootStateOrAny, useSelector } from 'react-redux'
import PriorityItem from './priority_item'

enum TypePiority {
  URGENT = 'urgent-icon',
  HIGH = 'high-icon',
  NORMAL = 'normal-icon',
  LOW = 'low-icon',
}

const priorityLevels = [
  {
    text: 'Urgent',
    value: 'URGENT',
    color: '#F24423',
  },
  {
    text: 'High',
    value: 'HIGH',
    color: '#FFCD37',
  },
  {
    text: 'Normal',
    value: 'NORMAL',
    color: '#70DCFC',
  },
  {
    text: 'Low',
    value: 'LOW',
    color: '#D8D8D8',
  },
  {
    text: 'Clear',
    value: '',
    color: '#F8B6B1',
  },
]

const Priority: React.FC = () => {
  const newTask = useSelector((state: RootStateOrAny) => state.taskBoards?.newTask)

  return (
    <PopupState variant='popover'>
    {(popupState) => (
      <React.Fragment>
        <Tooltip title='Set Priority' arrow={true} placement='top'>
            <OutlinedFlagIcon
              fontSize='small'
              className={`icon-add ${TypePiority[newTask?.priority || '']}`}
              {...bindTrigger(popupState)}
            />
        </Tooltip>
        <Menu
          {...bindMenu(popupState)}
          autoFocus={false}
          className='priority-popup'
        >
          {priorityLevels.map((val, key) => (
            <PriorityItem key={key} priorityLevel={val} close={() => popupState.close()}/>
          ))}
        </Menu>
      </React.Fragment>
    )}
  </PopupState>
  )
}

export default Priority
