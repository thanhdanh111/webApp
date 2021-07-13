import UsersPopupUI from '@components/users_popup/users_popup';
import { Container, Typography } from '@material-ui/core';
import { checkArray } from 'helpers/check_array';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers_registration';
import { setSelectedUserIDs } from '../logic/task_boards_action';
import { TaskBoardsType } from '../logic/task_boards_reducer';
import FilterTaskContentUI from './filter_task_content';
import CloseIcon from '@material-ui/icons/Close';

const FilteringTaskByUserUI: React.FC = () => {
  const {
    selectedUserIDs,
  }: TaskBoardsType = useSelector((state: RootState) => state.taskBoards);
  const dispatch = useDispatch();

  const selectedContent = useMemo(() => {
    return selectedUserIDs;
  }, [selectedUserIDs]);

  const handleRemoveUser = (value) => {
    const removeUser = selectedContent.filter((each) => each._id !== value);

    dispatch(setSelectedUserIDs(removeUser));
  };

  const showUserValue = checkArray(selectedContent) ? selectedContent?.map((each) => {
    return (
        <li className='value-item' key={each?._id}>
          <Typography className='text-value-item'>
          {(each.firstName?.trim() || each.lastName?.trim())
          ? `${each.firstName} ${each.lastName}`
          : `${each.email}`}
          </Typography>
          <div className='icon-value-item' onClick={() => handleRemoveUser(each?._id)}>
            <div className='icon-close-item'>
              <CloseIcon
                className='icon-item delete'
              />
            </div>
          </div>
        </li>
    );
  }) : [];

  return (
    <Container>
      <FilterTaskContentUI
        component={<UsersPopupUI chooseUser={setSelectedUserIDs} type='reduxAction' usersAssigned={selectedContent} />}
        valueElement={showUserValue}
        filterLabel='users'
      />
    </Container>
  );
};

export default (FilteringTaskByUserUI);
