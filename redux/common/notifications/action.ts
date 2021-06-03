import { NOTIFICATION_ACTION_TYPE } from './action_type';
import { Notification } from '../../../helpers/type';

export const PushNewNotification = (newNotification?: Notification) => {
  return {
    notification: newNotification,
    type: NOTIFICATION_ACTION_TYPE.PUSH_NEW_NOTIFICATION,
  };
};
