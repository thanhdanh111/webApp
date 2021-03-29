import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, ListItem } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { chooseInviteCompany } from '../logic/invite_actions';
import { InviteDepartmentInfo, InviteStateProps } from '../logic/invite_interface';
import { RootState } from 'redux/reducers_registration';

interface ChoosingCompanyProps {
  name: string;
  companyID: string;
  departments: InviteDepartmentInfo[];
}

type ChoosingCompanyType = ChoosingCompanyProps;

const ChooseCompaniesUI: FunctionComponent = () => {
  const dispatch = useDispatch();
  const { availInviteCompanies, hasNoCompanies }: InviteStateProps = useSelector((state: RootState) => state.inviteMembers);

  const ChoosingCompany = (props: ChoosingCompanyType) => {
    const { name, companyID, departments }: ChoosingCompanyType = props;

    return (
      <ListItem onClick={() => choseCompany({ name, companyID, departments })} button>
        <Typography variant='subtitle1' className='company-name'>{name}</Typography>
      </ListItem>
    );
  };

  function choseCompany({ name, companyID, departments }) {
    dispatch(chooseInviteCompany({ inviteCompany: { name, companyID, departments } }));
  }

  if (!availInviteCompanies?.length && !hasNoCompanies) {
    return <div className='skeleton-wrapper'>
      <Skeleton variant='text' className='skeleton' />
      <Skeleton variant='text' className='skeleton' />
      <Skeleton variant='text' className='skeleton' />
      <Skeleton variant='text' className='skeleton' />
      <Skeleton variant='text' className='skeleton' />
      <Skeleton variant='text' className='skeleton' />
    </div>;
  }

  if (!availInviteCompanies?.length && hasNoCompanies) {
    return <div className='empty-state'>
      <img alt='logo' width='100px' src='../document.svg'/>
      <Typography color='textSecondary' className='empty-state--text'>Not found any companies</Typography>
    </div>;
  }

  return (
    <>
      <div className='choose-company-layout'>
        {availInviteCompanies.map((company) => {
          return <ChoosingCompany
            key={`${company.companyID}`}
            companyID={company.companyID}
            name={company.name}
            departments={company.departments}
          />;
        })}
      </div>
    </>
  );
};

export default ChooseCompaniesUI;
