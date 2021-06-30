import React, { FunctionComponent } from 'react';
import { Link } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import PrimaryButtonUI from '@components/primary_button/primary_button';
import { backToChooseCompany, updateInviteMembers } from '../logic/invite_actions';
import { inviteMembersThunkAction } from '../logic/invite_thunk_actions';
import { InviteStateProps } from '../logic/invite_interface';
import { InputAndOptionsSelect } from '@components/input_and_options_select/input_and_options_select';
import { RootState } from 'redux/reducers_registration';
import { returnNotification } from '../logic/invite_error_notifications';
import { pushNewNotifications } from 'redux/common/notifications/reducer';

const roles = [
  {
    role: 'COMPANY_STAFF',
    name: 'company staff',
  },
  {
    role: 'DEPARTMENT_STAFF',
    name: 'department staff',
  },
  {
    role: 'COMPANY_MANAGER',
    name: 'company manager',
  },
  {
    role: 'DEPARTMENT_MANAGER',
    name: 'department manager',
  },
];

const InviteMembersUI: FunctionComponent = () => {
  const dispatch = useDispatch();
  const {
    inviteCompany,
    inviteLoading,
    inviteMembers,
  }: InviteStateProps = useSelector((state: RootState) => state.inviteMembers);
  const inviteMembersLength = inviteMembers.length;

  const firstOptions = roles.map((role) =>
    <option
      key={role.role}
      value={role.role}
    >
      {role.name}
    </option>,
  );

  const secondOptions = inviteCompany?.departments?.map((department) =>
    <option
      key={`${department.departmentID}`}
      value={department.departmentID}
    >
      {department.name}
    </option>,
  );

  function removePersonFillOut(index) {
    inviteMembers.splice(index, 1);

    dispatch(updateInviteMembers({ inviteMembers }));
  }

  function addMorePersonNumber() {
    const newIndex = inviteMembersLength;

    inviteMembers[newIndex] = {
      email: '',
      role: 'COMPANY_STAFF',
    };

    dispatch(updateInviteMembers({ inviteMembers }));
  }

  function handleFillingInfo(event, index) {
    const currentMember = inviteMembers[index] || { };

    currentMember[event.target.name] = event.target.value;

    inviteMembers[index] = currentMember;
  }

  function inviteMembersBtn()  {
    const regEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    const inviteMembersData = inviteMembers.filter((member, index) => {
      const validEmail = !member.email || regEmail.test(member.email);

      if (!member.departmentID) {
        delete inviteMembers[index]['departmentID'];
      }

      if (!validEmail) {
        const dataNotification = returnNotification({ type: 'invalidEmail', email: member.email });
        dispatch(pushNewNotifications({ variant: 'error' , message: dataNotification['message'] }));

        return;
      }

      return !!member.email;
    });

    dispatch(
      inviteMembersThunkAction({
        inviteMembersData,
        companyID: inviteCompany?.companyID,
      }),
    );
  }

  return (
    <>
      <div className='srcollable-invite-fillout'>

        {
          inviteMembers.map((member, index) => {
            const isFirst = index === 0;
            let firstInputLabel;
            let secondInputLabel;
            let thirdInputLabel;
            const defaultValues = [
              member.email,
              member.role,
              member.departmentID,
            ];

            if (isFirst) {
              firstInputLabel = 'Email Address';
              secondInputLabel = 'Role';
              thirdInputLabel = 'Department';
            }

            return <InputAndOptionsSelect
              key={`invite-member-${index}`}
              layoutClassName={`input-and-options-content--index-${index}-layout`}
              defaultValues={defaultValues}
              index={index}
              disableButton={isFirst}
              firstOptions={firstOptions}
              secondOptions={secondOptions}
              firstFormName='email'
              secondFormName='role'
              thirdFormName='departmentID'
              onClickCrossButton={removePersonFillOut}
              handleFillingInfo={handleFillingInfo}
              firstInputLabel={firstInputLabel}
              secondInputLabel={secondInputLabel}
              thirdInputLabel={thirdInputLabel}
            />;
          })
        }

      </div>

      <div className='invite-sub-content-wrapper'>
        <div className='invite-sub-content'>
        <Link
          component='button'
          variant='body2'
          onClick={() =>  addMorePersonNumber()}
          className='invite-sub-content--another'
        >
          + Add another
        </Link>

        <Link
          component='button'
          variant='body2'
          onClick={() => dispatch(backToChooseCompany())}
          className='invite-sub-content--another'
        >
          Choose company
        </Link>
        </div>
      </div>

      <PrimaryButtonUI
        title={inviteLoading ? 'Sending your request' : `Invite ${inviteMembersLength} Person`}
        handleClick={() => inviteMembersBtn()}
      />
    </>
  );
};

export default InviteMembersUI;
