import axios from 'axios';
import { config } from 'helpers/get_config';
import { Token } from 'helpers/type';
import { pushNewNotifications } from 'redux/common/notifications/reducer';
import { updateCompanyOnSending } from './company_actions';
import { handleEmptyField } from './company_errors';

const notificationsType = {
  200: 'Sent your letter successfully',
  400: 'You have no company right now!',
};

export const sendSlackCompanyToken = () => async (dispatch, getState) => {
  try {
    const authState = getState().auth;
    const companyID = authState?.extendedCompany?.companyID?._id;
    const slackToken = getState().company?.slackToken;
    const token: Token =  localStorage.getItem('access_token');

    if (!token || !companyID || !slackToken?.length) {
      const emptyNotification = handleEmptyField({ contentFields: { companyID, slackToken } });

      await dispatch(updateCompanyOnSending({ loading: false }));
      await dispatch(pushNewNotifications({ variant: 'error' , message: emptyNotification['message'] }));

      return;
    }

    await dispatch(updateCompanyOnSending({ loading: true }));

    const res = await axios({
      url: `${config.BASE_URL}/extendedCompanies/${companyID}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method: 'PUT',
      data: {
        slackToken,
      },
    });

    const notification = notificationsType[res.status];
    await dispatch(updateCompanyOnSending({ loading: false }));
    await dispatch(pushNewNotifications({ variant: 'success' , message: notification }));
  } catch (error) {
    const notification = notificationsType[error?.response?.status] || 'Something went wrong';
    await dispatch(updateCompanyOnSending({ loading: false }));
    await dispatch(pushNewNotifications({ variant: 'error' , message: notification }));
  }
};
