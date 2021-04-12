
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

const Graph: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const statistics = useSelector((state: RootStateOrAny) => state.statistics);
  const limit = statistics.limit;
  const userID = statistics.selectedUserID;
  useEffect(() => {
    void fetchCheckinData();
  }, [limit, userID]);

  const fetchCheckinData = () => {
    dispatch(getAllCheckInThunkAction());
  };

  const setLimit = (num: number) => {
    dispatch(limitStatistics(num));
  };

  const data = getGraphOptions(statistics.checkInCheckOuts);

  return (
    <>
      <Card className='bg-gradient-default' style={{ borderRadius: 10 }}>
        <CardContent>
          <Grid container alignContent='space-between'>
            <Grid item xs={8} className='header'>
              <Typography style={{ color: '#000000', fontSize: 11 }}>OVERVIEW</Typography>
              <Typography className='label-graph' style={{ color: '#000000', fontSize: 24, fontWeight: 700 }}>
                Check in & Check out time
              </Typography>
            </Grid>
            <Grid item xs={4} className='justify-content-end'>
              <SwitchButton handleClick={() => setLimit(7)} title='Week' isSelected={limit === 7} />
              <SwitchButton handleClick={() => setLimit(30)} title='Month' isSelected={limit !== 7} />
              <UserSelection />
            </Grid>
          </Grid>
          <Chart options={data} series={data.series} />
        </CardContent>
      </Card>
    </>
  );
};

export default Graph;
