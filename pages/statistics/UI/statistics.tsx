import { CircularProgress, Grid, IconButton } from '@material-ui/core';
import React, { FunctionComponent, useMemo, useState } from 'react';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import PersonIcon from '@material-ui/icons/Person';
import Graph from './graph';
import StatisticsCard from './statistics_card';
import StatisticsTable from './statistics_table';
import { useSelector, RootStateOrAny } from 'react-redux';
import { isAdminOrManagerUser } from 'helpers/check_role_user';
interface DataType {
  title: string;
}

type BodyProps = DataType;
const StatisticsUi: FunctionComponent<BodyProps> = () => {
  const access = useSelector((state: RootStateOrAny) => state.auth.access);
  const userID = useSelector((state: RootStateOrAny) => state.auth.userID);
  const company = useSelector((state: RootStateOrAny) => state.auth.extendedCompany.companyID);
  const isAdmin = useMemo(() => isAdminOrManagerUser(access, company?._id, null), [company?._id, access]);
  const [getMe, setGetMe] = useState(true);

  return (
    <div className='statistics-page'>
      <div className='statistics-header'>
        <Grid className='statistics-card-grid' container>
          <Grid item xs={12} sm={3} className='card-item'>
            <StatisticsCard title='Traffic' numTitle='350,879' variation={3.48} lastSync='last month' />
          </Grid>
          <Grid item xs={12} sm={3} className='card-item'>
            <StatisticsCard title='New User' numTitle='2,356' variation={-3.48} lastSync='last week' />
          </Grid>
          <Grid item xs={12} sm={3} className='card-item'>
            <StatisticsCard title='Sales' numTitle='924' variation={4} lastSync='yesterday' />
          </Grid>
          <Grid item xs={12} sm={3} className='card-item'>
            <StatisticsCard title='Performance' numTitle='49,65%' variation={12} lastSync='' />
          </Grid>
        </Grid>
      </div>
      <div className='statistics-body'>
        {!userID && !company?._id ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </div>
        ) : (
          <>
            <div className='statistics-body-options'>
              <IconButton
                onClick={() => setGetMe(true)}
                name='me'
                disabled={getMe}
                disableRipple
                disableFocusRipple
                size='medium'
              >
                <PersonIcon className='statistics-body-options-icon' fontSize='large' name='me' color={getMe ? 'secondary' : 'primary'} />
              </IconButton>
              {isAdmin && (
                <IconButton
                  onClick={() => setGetMe(false)}
                  name='members'
                  disabled={!getMe}
                  disableRipple
                  disableFocusRipple
                  size='medium'
                >
                  <PeopleAltIcon className='statistics-body-options-icon' fontSize='large' name='members' color={!getMe ? 'secondary' : 'primary'} />
                </IconButton>
              )}
            </div>
            <Grid container justify='center' >
              <Grid item xs={12} >
                <Graph getMe={getMe} isAdmin={isAdmin} />
              </Grid>
            </Grid>
            <Grid container justify='center'>
              <Grid item xs={12} >
                <StatisticsTable />
              </Grid>
            </Grid>
          </>
        )}
      </div>
    </div>
  );
};
export default StatisticsUi;
