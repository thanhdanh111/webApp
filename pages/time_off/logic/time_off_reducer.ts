import { TimeOffActionTypes } from './time_off_actions';
import { OptionState, TimeOffValue } from './time_off_interface';

const initialState: TimeOffValue = {
  ownTimeOffs: [],
  ownTimeOffsCursor: '',
  ownTimeOffsOffset: 0,
  ownTimeOffsTotalCount: 0,
  ownTimeOffsLoading: false,
  updateStatusLoading: false,
  membersTimeOffs: [],
  membersTimeOffsCursor: '',
  membersTimeOffsOffset: 0,
  membersTimeOffsLoading: false,
  membersTimeOffsTotalCount: 0,
  optionState: OptionState.me,
  notFoundAnyMembersTimeOffs: false,
  notFoundAnyOwnTimeOffs: false,
  onConfirm: false,
  onSelectTimeOffData: {},
  timeOffDetail: {},
};

function updateStatusTimeOffReducer({ action, state }) {
  if (!action.fieldName || typeof action.timeOffIndex !== 'number' || !action.status) {
    return {
      ...state,
      statusLoading: false,
    };
  }

  state[action.fieldName][action.timeOffIndex].status = action.status;

  const newState = { ...state, statusLoading: false };

  if (action.status !== 'PENDING') {
    newState.onConfirm = false;
  }

  return newState;
}

const timeOffReducer = (state = initialState, action) => {

  switch (action.type) {
    case TimeOffActionTypes.UpdatePaginationTimeOff:
      const { membersTimeOffs = [], ownTimeOffs = [] }: TimeOffValue = action.pagination;

      const newMembersTimeOffs = [...state.membersTimeOffs, ...membersTimeOffs];
      const newOwnTimeOffs = [...state.ownTimeOffs, ...ownTimeOffs];

      return {
        ...state,
        ...action.pagination,
        ...action.loadingStatus,
        membersTimeOffs: newMembersTimeOffs,
        ownTimeOffs: newOwnTimeOffs,
      };
    case TimeOffActionTypes.UpdateOptionState:
      return {
        ...state,
        optionState: action.optionState,
      };
    case TimeOffActionTypes.UpdateTimeOffLoadingStatus:
      return {
        ...state,
        ...action.loadingStatus,
      };
    case TimeOffActionTypes.UpdateStatusTimeOff:

      return updateStatusTimeOffReducer({ action, state });
    case TimeOffActionTypes.UpdateTimeOffIndexLoading:

      return {
        ...state,
        updateStatusLoading: action.isLoading,
        loadingIndex: action.loadingIndex,
        loadingOptionStateName: action.loadingOptionName,
      };
    case TimeOffActionTypes.UpdateOnConfirmDialog:

      return {
        ...state,
        onConfirm: action.onConfirm,
      };
    case TimeOffActionTypes.UpdateOnSelectTimeOff:

      return {
        ...state,
        onSelectTimeOffData: action.onSelectTimeOffData,
        onConfirm: action.onConfirm,
      };
    case TimeOffActionTypes.UpdateTimeOffsReducer:

      return {
        ...state,
        ...action.data,
      };
    case TimeOffActionTypes.getTimeOffByID:

      return {
        ...state,
        timeOffDetail: action.data,
      };
    default:
      return state;
  }
};

export default timeOffReducer;
