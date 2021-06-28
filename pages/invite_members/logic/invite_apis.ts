import axios from 'axios';
import { inviteLoading, updateInviteCompanies } from './invite_actions';
import { AvailInviteCompanies } from './invite_interface';
import { config } from 'helpers/get_config';
import { pushNewNotifications } from 'redux/common/notifications/reducer';
import { returnNotification } from './invite_error_notifications';
import { Roles } from 'constants/roles';
import { checkValidAccess } from 'helpers/check_valid_access';

type Token = string | null;
export enum NotificationTypes{
  error403 = 'You don\'t have permission to invite',
}
export const  inviteMembersApi = ({ companyID, inviteMembers = [] }) => async (dispatch) => {
  try {
    await dispatch(inviteLoading({ isLoading: true }));

    const token: Token =  localStorage.getItem('access_token');

    const res = await axios({
      url: `${config.BASE_URL}/companies/${companyID}/members/invite`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method: 'PUT',
      data: {
        inviteMembersData: inviteMembers,
      },
    });

    if (res?.data || res?.data?.length) {
      await Promise.all(res.data.map((info) => {
        const errorNotification = returnNotification({ type: info?.status, email: info?.email, message: info?.errorMessage });

        return dispatch(pushNewNotifications({ variant: errorNotification['status'] , message: errorNotification['message'] }));
      }));
    }

    await dispatch(inviteLoading({ isLoading: false }));
  } catch (error) {
    const errorNotification = returnNotification({ type: 'failed' });

    await dispatch(pushNewNotifications({ variant: 'error' , message: errorNotification['message'] }));

    await dispatch(inviteLoading({ isLoading: false }));
  }
};

export const getUserCompaniesApi = () => async (dispatch, getState) => {
  try {
    await dispatch(inviteLoading({ isLoading: true }));
    const userInfo = getState()?.userInfo;
    const token: Token = localStorage.getItem('access_token');
    const validAccesses = [Roles.COMPANY_MANAGER, Roles.DEPARTMENT_MANAGER];
    const haveAccess = checkValidAccess({ validAccesses, rolesInCompany: userInfo?.rolesInCompany });
    const isAdmin = userInfo?.isAdmin;
    let companiesParams = '';

    if (!isAdmin && haveAccess) {
      const companies: string[] = [userInfo?.currentCompany?._id];

      companiesParams = companies.map((companyID, index) => `companyID[${index}]=${companyID}`).join('&');
    }

    if (!isAdmin && !companiesParams?.length) {
      await dispatch(updateInviteCompanies({ availCompanies: [], isLoading: false }));

      return;
    }

    const getDepartments = await axios.get(
      `${config.BASE_URL}/departments?${companiesParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const noData = !getDepartments?.data?.list || !getDepartments?.data?.list?.length;

    if (noData) {
      await dispatch(updateInviteCompanies({ availCompanies: [], isLoading: false }));

      return;
    }

    const storeAvailCompaniesIndice = { };
    const availCompanies: AvailInviteCompanies[] = [];
    let indexForNewTempCompany = 0;

    getDepartments.data.list.forEach((availDepartment) => {
      const invalidCompany =
        !availDepartment?.companyID ||
        !availDepartment?.companyID?._id ||
        !availDepartment?.companyID?.name;
      const invalidDeparment = !availDepartment?.name || !availDepartment?._id;

      if (invalidCompany || invalidDeparment) {
        return;
      }

      const companyID = availDepartment?.companyID?._id ?? availDepartment?.companyID;
      let indexOfTempCompany = storeAvailCompaniesIndice[companyID];

      if (typeof indexOfTempCompany !== 'number') {
        storeAvailCompaniesIndice[companyID] = indexForNewTempCompany;
        indexOfTempCompany = indexForNewTempCompany;

        availCompanies[indexForNewTempCompany] = {
          companyID,
          name: availDepartment?.companyID?.name,
          departments: [
            {
              name: 'none',
              departmentID: '',
            },
          ],
        };

        indexForNewTempCompany = indexForNewTempCompany + 1;
      }

      let departmentsOfCompany =  availCompanies[indexOfTempCompany]['departments'];

      departmentsOfCompany = [
        ...departmentsOfCompany,
        {
          departmentID: availDepartment._id,
          name: availDepartment.name,
        },
      ];

      availCompanies[indexOfTempCompany]['departments'] = departmentsOfCompany;
    });

    await dispatch(updateInviteCompanies({ availCompanies, isLoading: false }));
  } catch (error) {

    await dispatch(pushNewNotifications({ variant: 'error' , message: NotificationTypes.error403 }));
    await dispatch(updateInviteCompanies({ availCompanies: [], isLoading: false }));
  }
};
