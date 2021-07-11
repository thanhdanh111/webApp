import UsersPopupUI from '@components/users_popup/users_popup';
import { Box, Button, IconButton, InputBase, NativeSelect, Popover, Typography } from '@material-ui/core';
import { Container } from 'next/app';
import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers_registration';
import { setCrrentFilterLabel, setSelectedTags, setSelectedUserIDs } from '../logic/task_boards_action';
import { TaskBoardsType } from '../logic/task_boards_reducer';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state';

const labelFiltering = {
  tags: 'Tags',
  userIDs: 'UserIDs',
};

const FilterTaskContentUI: React.FC = () => {
  const {
    currentFilterLabel,
    selectedUserIDs,
    selectedTags,
  }: TaskBoardsType = useSelector((state: RootState) => state.taskBoards);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const selectedContent = useMemo(() => {
    return selectedUserIDs;
  }, [selectedUserIDs]);

  const selectOptionLabel = Object.keys(labelFiltering).map((each) => {
    return (
      <option
        key={each}
        value={each}
      >
        {labelFiltering[each]}
      </option>
    );
  },
  );

  const onChangeFilterLabel = (event) => {
    dispatch(setCrrentFilterLabel(event.target.value));
  };

  const contentFiltering = {
    tags: {
      component:
        <></>,
      value: selectedTags,
      handleSelect: setSelectedTags,
    },
    userIDs: {
      component: <UsersPopupUI chooseUser={setSelectedUserIDs} type='reduxAction' />,
      value: selectedContent,
      handleSelect: setSelectedUserIDs,
    },
  };

  return (
    <Container className='filter-task-content'>
      <Typography className='title-popup' component='h4'>ACTIVE FILTERS</Typography>
      <div className='content-popup'>
        <Typography className='text-content-popup' component='span'>WHERE</Typography>
        <NativeSelect
          name='filtering-label'
          defaultValue={currentFilterLabel}
          onChange={onChangeFilterLabel}
          input={<InputBase className='sub-input-base' />}
        >
          {selectOptionLabel}
        </NativeSelect>

        <Container className='menu-content-value'>
          <input value={contentFiltering[currentFilterLabel]?.value} className='input-of-menu-value' />

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
                    {contentFiltering[currentFilterLabel]?.component}
                  </Box>
                </Popover>
              </div>
            )}
          </PopupState>
        </Container>
      </div>
    </Container>
  );
};

export default FilterTaskContentUI;
