import axios from 'axios';
import { config } from 'helpers/get_config';
import { Token } from 'helpers/type';
import {
  updatePaginationTimeOff, updateTimeOffIndexLoading,
  updateStatusTimeOff, updateTimeOffLoadingStatus,
} from './time_off_actions';
import { SelectedTimeOffDataType, TimeOffModel, TimeOffValue } from './time_off_interface';
import { getManagerIDs, GetManagerIDsType } from 'helpers/get_manager_ids_of_departments_and_companies';
import { checkManager } from './time_off_check_manager';
import moment from 'moment';

function isInvalidTimeOffApiData(timeOff) {
  if (!timeOff) {
    return true;
  }

  const hasCompanyName = timeOff?.companyID?.name;
  const hasStartTime = timeOff?.startTime;
  const hasEndTime = timeOff?.endTime;
  const hasId = timeOff?._id;
  const hasStatus = timeOff?.status;
  const hasName = timeOff?.createdBy?.firstName || timeOff?.createdBy?.lastName;
  const invalidApiData =  !hasCompanyName || !hasStartTime || !hasEndTime || !hasId || !hasStatus || !hasName;

  return invalidApiData;
}

interface GetTimeOffsByModel {
  userID?: string;
  managerCompanyIDs?: string[];
  managerDepartmentIDs?: string[];
  type: string;
  isExceptMeInMembers?: boolean;
}

function getTimeOffsByModel(data, { type, userID = '', managerCompanyIDs, managerDepartmentIDs, isExceptMeInMembers = true }
: GetTimeOffsByModel) {
  const timeOffs: TimeOffModel[] = [];
  const dateTimeUiFormat = 'DD/MM/YYYY HH:mm';

  if (!data || !data.length || typeof data === 'string') {

    return timeOffs;
  }

  const isTypeMembers = !!userID && type === 'members';

  data.forEach((timeOff) => {
    const invalidApiData = isInvalidTimeOffApiData(timeOff);
    const exceptMeInMembers = isTypeMembers && userID === timeOff?.createdBy?._id;

    if (invalidApiData || (isExceptMeInMembers && exceptMeInMembers)) {
      return;
    }

    const isManager = checkManager(
      type,
      timeOff,
      managerCompanyIDs,
      managerDepartmentIDs,
    );

    timeOffs.push({
      isManager,
      id: timeOff?._id,
      companyName: timeOff?.companyID?.name,
      startTime: moment(timeOff?.startTime).format(dateTimeUiFormat),
      endTime:  moment(timeOff?.endTime).format(dateTimeUiFormat),
      status: timeOff?.status,
      reason: timeOff?.reason ?? '',
      name: `${timeOff?.createdBy?.lastName ?? ''} ${timeOff?.createdBy?.firstName ?? ''}`,
      departmentName: timeOff?.departmentID?.name ?? '',
    });
  });

  return timeOffs;
}

interface GetUserDaysOffApi {
  limit: number;
  userID: string;
  cursor?: string;
  infiniteScroll?: boolean;
}

export const getUserDaysOffApi = ({
  limit = 10,
  userID,
  cursor,
  infiniteScroll = false,
}: GetUserDaysOffApi) => async (dispatch, getState) =>  {
  try {
    const token: Token =  localStorage.getItem('access_token');
    const state = getState();
    const authState = state?.auth;

    if (!infiniteScroll) {
      await dispatch(updateTimeOffLoadingStatus({
        loadingStatus: {
          ownTimeOffsLoading: true,
        },
      }));
    }

    const params = {
      limit,
      cursor,
      createdBy: userID,
    };

    const getDaysoff = await axios.get(
      `${config.BASE_URL}/daysoff`,
      {
        params,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!getDaysoff?.data) {
      await dispatch(updateTimeOffLoadingStatus({
        loadingStatus: {
          ownTimeOffsLoading: false,
        },
      }));

      return;
    }

    const {
      managerCompanyIDs,
      managerDepartmentIDs,
    }: GetManagerIDsType = getManagerIDs({ access: authState?.access });

    const timeOffs = getTimeOffsByModel(
      getDaysoff?.data?.list,
      {
        managerCompanyIDs,
        managerDepartmentIDs,
        userID: '',
        type: 'user',
        isExceptMeInMembers: true,
      },
    );

    await dispatch(
      updatePaginationTimeOff({
        loadingStatus: {
          ownTimeOffsLoading: false,
        },
        pagination: {
          notFoundAnyOwnTimeOffs: !timeOffs || !timeOffs?.length,
          ownTimeOffs: timeOffs,
          ownTimeOffsCursor: getDaysoff?.data?.cursor,
          ownTimeOffsTotalCount: getDaysoff?.data?.totalCount,
        },
      },
    ));
  } catch (error) {
    await dispatch(updateTimeOffLoadingStatus({
      loadingStatus: {
        ownTimeOffsLoading: false,
      },
    }));
  }
};

interface GetMembersDaysOffApi {
  limit: number;
  cursor?: string;
  infiniteScroll?: boolean;
  userID: string;
  isExceptMeInMembers?: boolean;
}

export const getMembersDaysOffApi = ({
  limit = 10,
  cursor,
  infiniteScroll = false,
  userID,
  isExceptMeInMembers = true,
}: GetMembersDaysOffApi) => async (dispatch, getState) =>  {
  try {
    const token: Token =  localStorage.getItem('access_token');
    const state = getState();
    const authState = state?.auth;

    if (!authState || !authState?.extendedUser) {
      return;
    }

    if (!infiniteScroll) {
      await dispatch(updateTimeOffLoadingStatus({
        loadingStatus: {
          membersTimeOffsLoading: true,
        },
      }));
    }

    const params = {
      limit,
      cursor,
    };

    let queryArrayParams = '';

    const {
      isAdmin,
      managerCompanyIDs,
      managerDepartmentIDs,
    }: GetManagerIDsType = getManagerIDs({ access: authState?.access });

    if (!isAdmin && (managerCompanyIDs?.length || managerDepartmentIDs.length)) {
      const stringCompanies = managerCompanyIDs.
          map((companyID, index) => `orCompanyIDs[${index}]=${companyID}`);

      const stringDepartments = managerDepartmentIDs.
          map((departmentID, index) => `orDepartmentIDs[${index}]=${departmentID}`);

      queryArrayParams = `?${[...stringCompanies, ...stringDepartments].join('&')}`;
    }

    const getDaysoff = await axios.get(
      `${config.BASE_URL}/daysoff${queryArrayParams}`,
      {
        params,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!getDaysoff?.data) {
      await dispatch(updateTimeOffLoadingStatus({
        loadingStatus: {
          membersTimeOffsLoading: false,
        },
      }));

      return;
    }

    const timeOffs = getTimeOffsByModel(
      getDaysoff?.data?.list,
      {
        userID,
        isExceptMeInMembers,
        type: 'members',
      },
    );

    await dispatch(
      updatePaginationTimeOff({
        loadingStatus: {
          membersTimeOffsLoading: false,
        },
        pagination: {
          membersTimeOffs: timeOffs,
          notFoundAnyMembersTimeOffs: !timeOffs || !timeOffs?.length,
          membersTimeOffsCursor: getDaysoff?.data?.cursor,
          membersTimeOffsTotalCount: getDaysoff?.data?.totalCount,
        },
      },
    ));
  } catch (error) {
    await dispatch(updateTimeOffLoadingStatus({
      loadingStatus: {
        membersTimeOffsLoading: false,
      },
    }));
  }
};

function shouldHaveChangeStatusTimeOffData({ onSelectTimeOffData }) {
  let canContinue = false;
  const { timeOffID, status, timeOffIndex, fieldName }: SelectedTimeOffDataType = onSelectTimeOffData;

  if (!onSelectTimeOffData) {
    return false;
  }

  canContinue = !!timeOffID && !!status && !!timeOffIndex && !!fieldName;

  return canContinue;
}

export const changeStatusOfTimeOff = () => async (dispatch, getState) => {
  try {
    const timeOffState: TimeOffValue = getState()?.timeoff;
    const haveValidData = shouldHaveChangeStatusTimeOffData({ onSelectTimeOffData: timeOffState?.onSelectTimeOffData });

    if (!haveValidData || timeOffState.updateStatusLoading) {
      return;
    }

    const { timeOffID, status, timeOffIndex, fieldName }: SelectedTimeOffDataType = timeOffState?.onSelectTimeOffData;

    await dispatch(updateTimeOffIndexLoading({
      isLoading: true,
      loadingIndex: timeOffIndex,
      loadingOptionName: fieldName,
    }));

    const token: Token = localStorage.getItem('access_token');

    const changeStatus = await axios({
      url: `${config.BASE_URL}/daysoff/${timeOffID}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method: 'PUT',
      data: {
        status,
      },
    });

    if (!changeStatus?.data?.status) {
      await dispatch(updateTimeOffIndexLoading({
        isLoading: false,
        loadingIndex: undefined,
        loadingOptionName: undefined,
      }));

      return;
    }

    await dispatch(updateStatusTimeOff({ fieldName, timeOffIndex, status: changeStatus?.data?.status }));
    await dispatch(updateTimeOffIndexLoading({
      isLoading: false,
      loadingIndex: undefined,
      loadingOptionName: undefined,
    }));
  } catch (error) {
    await dispatch(updateTimeOffIndexLoading({
      isLoading: false,
      loadingIndex: undefined,
      loadingOptionName: undefined,
    }));
  }
};
