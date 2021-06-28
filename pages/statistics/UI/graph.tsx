
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import SwitchButton from './switch_button';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { getAllCheckInThunkAction } from '../logic/statistics_reducer';
import { limitStatistics } from '../logic/statistics_actions';
import { getGraphOptions } from '../../../helpers/get_statistics_data';
import UserSelection from './user_selection';

interface GraphProps {
  getMe: boolean;
  isAdmin: boolean;
}

const Graph: React.FunctionComponent<GraphProps> = (props) => {
  const dispatch = useDispatch();
  const statistics = useSelector((state: RootStateOrAny) => state.statistics);
  const limit = statistics.limit;
  const userID = statistics.selectedUserID;
  const { getMe, isAdmin }: GraphProps = props;
  useEffect(() => {
    void fetchCheckinData();
  }, [limit, userID, getMe]);

  const fetchCheckinData = () => {
    dispatch(getAllCheckInThunkAction(getMe));
  };

  const setLimit = (num: number) => {
    dispatch(limitStatistics(num));
  };

  const data = getGraphOptions(statistics.checkInCheckOuts);

  return (
      <Card className='bg-gradient-default' style={{ borderRadius: 10 }}>
        <CardContent className='gragh-content'>
          <Grid container alignContent='space-between' className='graph-header'>
            <Grid item xs={8} className='header'>
              <Typography style={{ color: '#000000', fontSize: 11 }}>OVERVIEW</Typography>
              <Typography className='label-graph' style={{ color: '#000000', fontSize: 24, fontWeight: 700 }}>
                Check in & Check out time
              </Typography>
            </Grid>
            <Grid item xs={4} className='justify-content-end'>
              <SwitchButton handleClick={() => setLimit(7)} title='Week' isSelected={limit === 7} />
              <SwitchButton handleClick={() => setLimit(30)} title='Month' isSelected={limit !== 7} />
              {!getMe && isAdmin && <UserSelection />}
            </Grid>
          </Grid>
          <Chart options={data} series={data.series} />
        </CardContent>
      </Card>

  );
};

export default Graph;
