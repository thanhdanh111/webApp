import { Box, Button, IconButton, Popover } from '@material-ui/core';
import React, { useState } from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';
import { checkIfEmptyArray } from 'helpers/check_if_empty_array';

interface InitialProps {
  component: JSX.Element;
  valueElement: JSX.Element[];
  filterLabel: string;
}

const FilterTaskContentUI: React.FC<InitialProps> = ({ component, valueElement, filterLabel }) => {
  const [open, setOpen] = useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <>
      <ul className='input-of-menu-value' >
        {checkIfEmptyArray(valueElement) ? valueElement : `Filtering tasks by ${filterLabel}`}
      </ul>

      <PopupState variant='popover' popupId='demo-popup-popover'>
        {(popupState) => (
          <div>
            <Button variant='contained' color='primary' {...bindTrigger(popupState)} className='btn-menu-content'>
              <IconButton
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup='true'
                onClick={handleToggle}
                className='action-status-btn-menu-content'
              >
                <div className='action action-filter'>
                  <ArrowDropDownIcon />
                </div>
              </IconButton>
            </Button>
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
          </div>
        )}
      </PopupState>
    </>
  );
};

export default FilterTaskContentUI;
