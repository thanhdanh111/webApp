import axios from 'axios';
import { config } from 'helpers/get_config';
import { CheckInCheckOut } from 'helpers/type';
import { statisticsAction } from './statistics_type_action';
import { getAllStatistics } from './statistics_actions';

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

export const getAllCheckInThunkAction = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const companyID = '6048780998f1360008f5f883';
    const token = localStorage.getItem('access_token');
    const cursor = state.statistics.cursor;
    const limit = state.statistics.limit;
    const toTime = new Date();
    const fromTime = new Date(toTime.getTime() - limit * 1000 * 60 * 60 * 24);
    const userID = state.statistics.selectedUserID;
    const requestUser = (userID === '') ? '' : `&userID=${userID}`;
    if (cursor === 'END' || !token || !companyID) {
      return;
    }

    const res =
      await axios.get(`${config.BASE_URL}/checkinAndCheckouts?companyID=${companyID}${requestUser}&fromTime=${fromTime}&toTime=${toTime}&cursor=${cursor}`, {
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
