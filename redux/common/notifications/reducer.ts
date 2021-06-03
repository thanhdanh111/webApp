import { NOTIFICATION_ACTION_TYPE } from './action_type';
import { Notification } from '../../../helpers/type';
import { PushNewNotification } from './action';

const initialState: Notification = {
  variant: 'error',
  message: '',
};

export const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTION_TYPE.PUSH_NEW_NOTIFICATION:

      return {
        ...state,
        variant: action.notification.variant || 'error',
        message: action.notification.message || '',
      };
    default:
      return state;
  }
};

export const pushNewNotifications = (notification: Notification) => async (dispatch) => {
  try {
    await dispatch(PushNewNotification(notification));
  } catch (error) {
    await dispatch(PushNewNotification({ variant: 'error', message: String(error) }));
  }
};
