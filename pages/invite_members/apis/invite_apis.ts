import axios from 'axios';
import { inviteLoading, updateInviteCompanies, updateInviteResultInfo } from '../logic/invite_actions';
import { AvailInviteCompanies } from '../logic/invite_interface';
import { config } from 'helpers/get_config';

type Token = string | null;

export const  inviteMembersApi = ({ companyID, inviteMembers = [] }) => async (dispatch) => {
  try {
    await dispatch(inviteLoading({ isLoading: true }));

    const token: Token =  localStorage.getItem('access_token');

    const res = await axios({
      url: `${config.LOCAL_HOST}/companies/${companyID}/members/invite`,
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
      const resultInfo = res?.data?.map((info) => {

        return {
          status: info?.status,
          message: info?.errorMessage,
          email: info?.email,
          role: info?.role,
        };
      });

      await dispatch(updateInviteResultInfo({ inviteResultInfo: resultInfo }));
    }

    await dispatch(inviteLoading({ isLoading: false }));
  } catch (error) {
    const errorNotification = {
      status: String(error.response?.data?.statusCode ?? ''),
      message: error?.response?.data?.message,
      email: '',
      role: '',
    };

    await dispatch(updateInviteResultInfo({ inviteResultInfo: [errorNotification] }));

    await dispatch(inviteLoading({ isLoading: false }));
  }
};

const rolesCouldInvite = ['COMPANY_MANAGER'];

export const getUserCompaniesApi = ({ isAdmin }) => async (dispatch) => {
  try {
    await dispatch(inviteLoading({ isLoading: true }));

    const token: Token = localStorage.getItem('access_token');

    if (!token) {
      return;
    }

    const userInfo = await axios.get(`${config.LOCAL_HOST}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userInfo?.data?.access || !userInfo?.data?.access.length) {
      await dispatch(updateInviteCompanies({ availCompanies: [], isLoading: false }));

      return;
    }

    let companiesParams = '';

    if (!isAdmin) {
      const companies: string[] = [];

      userInfo?.data?.access.forEach((access) => {
        const hasInvalidRole = access?.role && !rolesCouldInvite?.includes(access.role);

        if (!access.companyID || hasInvalidRole) {
          return;
        }

        companies.push(access.companyID);
      });

      companiesParams = companies.map((companyID, index) => `companyID[${index}]=${companyID}`).join('&');
    }

    if (!isAdmin && !companiesParams) {
      await dispatch(updateInviteCompanies({ availCompanies: [], isLoading: false }));

      return;
    }

    const getDepartments = await axios.get(
      `${config.LOCAL_HOST}/departments?${companiesParams}`,
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
    const errorNotification = {
      status: String(error.response?.data?.statusCode ?? ''),
      message: error?.response?.data?.message,
      email: '',
      role: '',
    };

    await dispatch(updateInviteResultInfo({ inviteResultInfo: [errorNotification] }));
    await dispatch(updateInviteCompanies({ availCompanies: [], isLoading: false }));
  }
};
