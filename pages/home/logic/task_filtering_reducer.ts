import { TaskFilteringTypes } from './task_filtering_action';

export interface TaskFilteringState {
  isMe?: boolean;
  isEveryOne?: boolean;
  tags?: string[];
  priority?: string;
  taskTitle?: string;
  assigneeIds?: string[];
}

const initialState: TaskFilteringState = {
  isMe: false,
};

const taskFilteringReducer = (state = initialState, action) => {
  switch (action.type) {
    case TaskFilteringTypes.setTaskFiltering:
      if (!!action.data.isMe) {
        action.data.isEveryOne = !action.data.isMe;
      }

      if (!!action.data.isEveryOne) {
        action.data.isMe = !action.data.isEveryOne;
      }

      return {
        ...state,
        ...action.data,
      };
    default:
      return state;
  }
};

export default taskFilteringReducer;
