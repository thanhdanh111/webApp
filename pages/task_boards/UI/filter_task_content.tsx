import { Box, IconButton, Popover } from '@material-ui/core'
import React from 'react'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state'
import { checkIfEmptyArray } from 'helpers/check_if_empty_array'

interface InitialProps {
  component: JSX.Element
  valueElement: JSX.Element[]
  filterLabel: string
}

const FilterTaskContentUI: React.FC<InitialProps> = ({ component, valueElement, filterLabel }) => {
  const anchorRef = React.useRef<HTMLButtonElement>(null)

  return (
    <>
      <div className='input-of-menu-value' >
        <div className='input-of-menu-value--content'>
          {checkIfEmptyArray(valueElement) ? valueElement : `Filtering tasks by ${filterLabel}`}
        </div>
        <PopupState variant='popover' popupId='demo-popup-popover'>
        {(popupState) => (
          <>
            <IconButton
              ref={anchorRef}
              aria-haspopup='true'
              {...bindTrigger(popupState)}
              className='action-status-btn-menu-content'
            >
              <ArrowDropDownIcon />
            </IconButton>
            <Popover
              {...bindPopover(popupState)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <Box p={2}>
                {component}
              </Box>
            </Popover>
          </>
        )}
      </PopupState>
      </div>
    </>
  )
}

export default FilterTaskContentUI
