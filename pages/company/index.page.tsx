import React, { useEffect, useState } from 'react';
import PageCardUi from '@components/page_card/page_card';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/reducers_registration';
import { useSnackbar, WithSnackbarProps } from 'notistack';
import { updateCompanyNotifications } from './logic/company_actions';
import { CompanyStateType } from './logic/company_reducer';
import ConnectSlackTabUi from './UI/connect_slack_tab';
import TabsUi from '@components/tabs/tabs';
import SettingsInputAntennaIcon from '@material-ui/icons/SettingsInputAntenna';

const references = ['General', 'Company', 'Company Settings'];
const tabs = ['slack team'];
const tabIcons = [SettingsInputAntennaIcon];
const tabUIs = [ConnectSlackTabUi];

const CompanyPage = () => {
  const { companyNotifications  }: CompanyStateType  = useSelector((state: RootState) => state.company);
  const dispatch = useDispatch();
  const { enqueueSnackbar }: WithSnackbarProps = useSnackbar();
  const [currentTabIndex, setCurrentTab] = useState(0);

  useEffect(pushNotification, [companyNotifications]);

  function pushNotification() {

    if (companyNotifications && companyNotifications.length) {
      for (const notification of companyNotifications) {
        if (!notification) {
          continue;
        }

        enqueueSnackbar(notification.message, { variant: notification['variant'] });
      }

      dispatch(updateCompanyNotifications({ notifications: [] }));
    }

    return;
  }

  function handleChange(_: React.ChangeEvent<{}>, newValue: number) {
    setCurrentTab(newValue);
  }

  return (
    <>
      <PageCardUi references={references} heading='Company' />
      <TabsUi
        tabs={tabs}
        currentTabIndex={currentTabIndex}
        tabIcons={tabIcons}
        tabUIs={tabUIs}
        handleChange={handleChange}
      />
    </>
  );
};

export default CompanyPage;
