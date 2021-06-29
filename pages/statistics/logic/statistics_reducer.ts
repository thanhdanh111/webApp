import axios from 'axios';
import { config } from 'helpers/get_config';
import { CheckInCheckOut } from 'helpers/type';
import { statisticsAction } from './statistics_type_action';
import { getAllStatistics } from './statistics_actions';
import { RootState } from 'redux/reducers_registration';

interface StatisticsValue {
  checkInCheckOuts: CheckInCheckOut[];
  selectedUserID: string;
  cursor: string;
  loading: boolean;
  limit: number;
}

const initialState: StatisticsValue = {
  checkInCheckOuts: [],
  selectedUserID: '',
  cursor: '',
  loading: false,
  limit: 7,
};

const statisticsReducer = (state = initialState, action) => {
  switch (action.type) {
    case statisticsAction.GET_LIST_CHECKIN_CHECKOUT:
      return {
        ...state,
        checkInCheckOuts: action.payload.list,
      };
    case statisticsAction.SELECTED_USERID:
      return {
        ...state,
        selectedUserID: action.payload.userID,
      };
    case statisticsAction.LIMIT_TRACKING:
      return {
        ...state,
        limit: action.payload.limit,
      };
    default:
      return state;
  }
};

export default statisticsReducer;

export const getAllCheckInThunkAction = (isGetMe: boolean = false) => async (dispatch, getState) => {
  try {
    const state = getState();
    const token = localStorage.getItem('access_token');
    const {
      statistics: {
        cursor,
        limit,
        selectedUserID,
      },
      userInfo: {
        currentCompany: {
          _id: companyID,
        },
        userID,
      },
    }: RootState = state;
    const toTime = new Date();
    const fromTime = new Date(toTime.getTime() - limit * 1000 * 60 * 60 * 24);
    let requestUser = '';
    if (isGetMe) {
      requestUser = userID;
    } else if (selectedUserID) {
      requestUser = selectedUserID;
    }

    if (cursor === 'END' || !token || !companyID) {
      return;
    }

    const params = {
      companyID,
      fromTime: fromTime.toString(),
      toTime: toTime.toString(),
    };

    if (cursor) {
      params['cursor'] = cursor;
    }

    if (requestUser) {
      params['userID'] = requestUser;
    }

    const res =
    await axios.get(`${config.BASE_URL}/checkinAndCheckouts`, {
      params,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data.totalCount === 0) {
      await dispatch(getAllStatistics([]));

      return;
    }

    await dispatch(getAllStatistics(res.data.list));
  } catch (error) {
    throw error;
  }
};
