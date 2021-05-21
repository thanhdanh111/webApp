import axios from 'axios';
import { config } from 'helpers/get_config';
import { Token } from 'helpers/type';
import { updateCompanyOnSending } from './company_actions';
import { handleCompanyErrors, handleEmptyField } from './company_errors';

export const sendSlackCompanyToken = () => async (dispatch, getState) => {
  try {
    const authState = getState().auth;
    const companyID = authState?.extendedCompany?.companyID?._id;
    const slackToken = getState().company?.slackToken;
    const token: Token =  localStorage.getItem('access_token');

    if (!token || !companyID || !slackToken?.length) {
      const emptyNotification = handleEmptyField({ contentFields: { companyID, slackToken } });

      await dispatch(updateCompanyOnSending({ loading: false, notifications: [emptyNotification] }));

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

    const notification = handleCompanyErrors({ statusCode: res.status });

    await dispatch(updateCompanyOnSending({ loading: false, notifications: [notification] }));
  } catch (error) {
    const notification = handleCompanyErrors({ statusCode: error?.response?.status });

    await dispatch(updateCompanyOnSending({ loading: false, notifications: [notification] }));
  }
};
