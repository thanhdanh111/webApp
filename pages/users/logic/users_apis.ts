import axios from 'axios';
import { checkOnlyTrueInArray } from 'helpers/check_only_true';
import { config } from 'helpers/get_config';
import { updateUsersReducer } from './users_actions';

export const removeUserFromDepartment = ({ onSearch }) => async (dispatch, getState) => {
  try {
    const usersState = getState()?.users;
    const token = localStorage.getItem('access_token');
    const departmentID  = usersState?.editingUserInfo?.editingDepartment?.departmentID;
    const departmentRole = usersState?.editingUserInfo?.editingDepartment?.role;
    const companyID = usersState?.editingUserInfo?.userData?.companyID?._id;
    const userIndex = usersState?.editingUserInfo?.userIndex;
    const userRenderID = usersState?.editingUserInfo?.userData?.userID?._id;

    const validData = checkOnlyTrueInArray({
      conditionsArray: [
        !!token,
        !!departmentID,
        !!companyID,
        !!departmentRole,
        userIndex !== undefined,
      ],
    });

    if (!validData) {
      dispatch(updateUsersReducer({ onRemovingUser: false }));

      return;
    }

    await axios({
      url: `${config.BASE_URL}/companies/${companyID}/department/${departmentID}/members`,
      data: {
        userID: userRenderID,
        role: departmentRole,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method: 'DELETE',
    });

    if (onSearch) {
      const newListSearch  = usersState?.listSearch;

      newListSearch[userIndex].departmentRoles =
        newListSearch?.[userIndex]?.departmentRoles?.filter((role) => {
          return role?.role !== departmentRole;
        });

      const newListAfterEditingSearch = usersState?.list?.map((user) => {
        if (user?.id?.userID === userRenderID) {
          return {
            ...user,
            departmentRoles: newListSearch?.[userIndex]?.departmentRoles,
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
      newList?.[userIndex]?.departmentRoles?.filter((role) => {
        return role?.role !== departmentRole;
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

export const removeUserFromCompany = ({ onSearch }) => async (dispatch, getState) => {
  try {
    const usersState = getState()?.users;
    const token = localStorage.getItem('access_token');
    const companyID = usersState?.editingUserInfo?.userData?._id?.companyID;
    const companyRole = usersState?.editingUserInfo?.editingCompany?.companyRole;
    const userID = usersState?.editingUserInfo?.userData?._id?.userID;

    const validData = checkOnlyTrueInArray({
      conditionsArray: [
        !!companyID,
        !!companyRole,
        !!userID,
      ],
    });

    if (!validData) {
      dispatch(updateUsersReducer({ onRemovingUser: false }));

      return;
    }

    await axios({
      url: `${config.BASE_URL}/companies/${companyID}/members`,
      data: {
        userID,
        role: companyRole,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method: 'DELETE',
    });

    if (onSearch) {
      const newListSearch  = usersState?.listSearch?.filter((user) => {
        if (user?.id?.userID === userID) {
          return false;
        }

        return true;
      });

      const newListAfterEditingSearch = usersState?.list?.filter((user) => {
        if (user?.id?.userID === userID) {

          return false;
        }

        return true;
      });

      dispatch(updateUsersReducer({
        listSearch: newListSearch,
        onRemovingUser: false,
        editingUserInfo: { },
        list: newListAfterEditingSearch,
      }));

      return;
    }

    const newList  = usersState?.list?.filter((user) => {
      if (user?.id?.userID === userID) {

        return false;
      }

      return true;
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
