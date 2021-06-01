import axios from 'axios';
import { config } from 'helpers/get_config';
import { updateUsersReducer } from './users_actions';

export const deleteUserFromDepartment = ({ onSearch }) => async (dispatch, getState) => {
  try {
    const usersState = getState()?.users;
    const token = localStorage.getItem('access_token');
    const accessID  = usersState?.editingUserInfo?.accessID;
    const userIndex = usersState?.editingUserInfo?.userIndex;
    const userRenderID = usersState?.editingUserInfo?.id;

    if (!token || !accessID || typeof userIndex !== 'number') {
      dispatch(updateUsersReducer({ onRemovingUser: false }));

      return;
    }

    await axios({
      url: `${config.BASE_URL}/userAccesses/${accessID}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method: 'DELETE',
    });

    if (onSearch) {
      const newListSearch  = usersState?.listSearch;

      newListSearch[userIndex].departmentRoles =
        newListSearch?.[userIndex]?.departmentRoles?.filter((departmentRole) => {
          return departmentRole._id !== accessID;
        });

      const newListAfterEditingSearch = usersState?.list.map((user) => {
        if (user.id === userRenderID) {
          return {
            ...user,
            departmentRoles: newListSearch[userIndex].departmentRoles,
          };
        }

        return user;
      });

      dispatch(updateUsersReducer({
        listSearch: newListSearch,
        onRemovingUser: false,
        editingUserInfo: { },
        list: newListAfterEditingSearch,
      }));

      return;
    }

    const newList  = usersState?.list;

    newList[userIndex].departmentRoles =
      newList?.[userIndex]?.departmentRoles?.filter((departmentRole) => {
        return departmentRole._id !== accessID;
      });

    dispatch(updateUsersReducer({
      list: newList,
      onRemovingUser: false,
      editingUserInfo: { },
    }));

    return;
  } catch (error) {
    dispatch(updateUsersReducer({ onRemovingUser: false }));
  }
};

export const acceptUserFromDepartment = ({ onSearch }) => async (dispatch, getState) => {
  try {
    const usersState = getState()?.users;
    const token = localStorage.getItem('access_token');
    const accessID  = usersState?.editingUserInfo?.accessID;
    const userIndex = usersState?.editingUserInfo?.userIndex;

    if (!token || !accessID || !userIndex) {
      return;
    }

    await axios({
      url: `${config.BASE_URL}/userAccesses/${accessID}`,
      data: {
        status: 'ACCEPTED',
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method: 'PUT',
    });

    if (onSearch) {
      const newListSearch  = usersState?.listSearch;

      newListSearch[userIndex].departmentRoles =
        newListSearch?.[userIndex]?.departmentRoles?.map((departmentRole) => {
          if (departmentRole._id === accessID) {
            return {
              ...departmentRole,
              status: 'ACCEPTED',
            };
          }

          return departmentRole;
        });

      dispatch(updateUsersReducer({ listSearch: newListSearch }));

      return;
    }

    const newList  = usersState?.list;

    newList[userIndex].departmentRoles =
      newList?.[userIndex]?.departmentRoles?.map((departmentRole) => {
        if (departmentRole._id === accessID) {
          return {
            ...departmentRole,
            status: 'ACCEPTED',
          };
        }

        return departmentRole;
      });

    dispatch(updateUsersReducer({ list: newList }));

    return;
  } catch (error) {
    return;
  }
};
