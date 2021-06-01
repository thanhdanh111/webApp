import axios from 'axios';
import { inviteLoading, updateInviteCompanies, updateInviteResultInfo } from './invite_actions';
import { AvailInviteCompanies } from './invite_interface';
import { config } from 'helpers/get_config';

type Token = string | null;

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

export const getUserCompaniesApi = () => async (dispatch, getState) => {
  try {
    let isAdmin = false;
    await dispatch(inviteLoading({ isLoading: true }));

    const token: Token = localStorage.getItem('access_token');
    const userInfo = getState().access;

    if (!userInfo?.access || !userInfo?.access.length) {
      await dispatch(updateInviteCompanies({ availCompanies: [], isLoading: false }));

      return;
    }

    let companiesParams = '';
    const usedCompanies = {};

    if (!isAdmin) {
      const companies: string[] = [];

      userInfo?.access.forEach((access, index) => {
        const hasInvalidRole = access?.role && !rolesCouldInvite?.includes(access.role);

        if (access?.role && access?.role === 'ADMIN') {
          isAdmin = true;

          return;
        }

        const companyID = access?.companyID;

        if (typeof usedCompanies[companyID] === 'number') {
          return;
        }

        if (!companyID || hasInvalidRole) {
          return;
        }

        usedCompanies[companyID] = index;
        companies.push(companyID);
      });

      companiesParams = companies.map((companyID, index) => `companyID[${index}]=${companyID}`).join('&');
    }

    if (!isAdmin && !companiesParams) {
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
