import React, { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, ListItem } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { AvailInviteCompanies, InviteDepartmentInfo } from '../logic/invite_interface';
import { updateInviteMembers } from '../logic/invite_actions';

interface ChoosingCompanyProps {
  name: string;
  companyID: string;
  departments: InviteDepartmentInfo[];
}

type ChoosingCompanyType = ChoosingCompanyProps;

interface ChooseCompanies {
  companies: AvailInviteCompanies[];
  hasNoCompanies: boolean;
}

const ChooseCompaniesUI: FunctionComponent<ChooseCompanies> = ({
  companies,
  hasNoCompanies,
}) => {
  const dispatch = useDispatch();

  const ChoosingCompany = (props: ChoosingCompanyType) => {
    const { name, companyID, departments }: ChoosingCompanyType = props;

    return (
      <ListItem onClick={() => choseCompany({ name, companyID, departments })} button>
        <Typography variant='subtitle1' className='company-name'>{name}</Typography>
      </ListItem>
    );
  };

  function choseCompany({ name, companyID, departments }) {
    dispatch(updateInviteMembers({ inviteCompany: { name, companyID, departments } }));
  }

  if (!companies?.length && !hasNoCompanies) {
    return <div className='skeleton-wrapper'>
      <Skeleton variant='text' className='skeleton' />
      <Skeleton variant='text' className='skeleton' />
      <Skeleton variant='text' className='skeleton' />
      <Skeleton variant='text' className='skeleton' />
      <Skeleton variant='text' className='skeleton' />
      <Skeleton variant='text' className='skeleton' />
    </div>;
  }

  if (!companies?.length && hasNoCompanies) {
    return <div className='empty-state'>
      <img alt='logo' width='100px' src='../document.svg'/>
      <Typography color='textSecondary' className='empty-state--text'>Not found any companies</Typography>
    </div>;
  }

  return (
    <>
      <div className='choose-company-layout'>
        {companies.map((company) => {
          return <ChoosingCompany
            key={`${company.companyID}`}
            companyID={company?.companyID}
            name={company?.name}
            departments={company?.departments}
          />;
        })}
      </div>
    </>
  );
};

export default ChooseCompaniesUI;
