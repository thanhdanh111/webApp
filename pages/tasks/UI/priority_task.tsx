import { Menu } from '@material-ui/core'
import React from 'react'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state'
import PriorityItem from './priority_item'

export const priorityLevels = {

  URGENT: {
    text: 'Urgent',
    value: 'URGENT',
    color: '#F24423',
  },
  HIGH: {
    text: 'High',
    value: 'HIGH',
    color: '#FFCD37',
  },
  NORMAL: {
    text: 'Normal',
    value: 'NORMAL',
    color: '#70DCFC',
  },
  LOW: {
    text: 'Low',
    value: 'LOW',
    color: '#D8D8D8',
  },
  default: {
    text: 'Clear',
    value: '',
    color: '#F8B6B1',
  },
}

interface InitialProp {
  getPriority: (tags) => void
}

const Priority: React.FC<InitialProp> = (props) => {

  return (
    <PopupState variant='popover'>
      {(popupState) => (
        <React.Fragment>
          <div {...bindTrigger(popupState)}>{props.children}</div>
          <Menu
            {...bindMenu(popupState)}
            autoFocus={false}
            className='priority-popup'
          >
            {Object.values(priorityLevels).map((val, key) => (
              <PriorityItem
                key={key}
                priorityLevel={val}
                changePriority={() => {
                  props.getPriority(val.value)
                  popupState.close()
                }}
              />
            ))}
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  )
}

export default Priority
