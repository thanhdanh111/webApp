
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import SwitchButton from './switch_button';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { getAllCheckInThunkAction } from '../logic/statistics_reducer';
import { limitStatistics } from '../logic/statistics_actions';
import UserSelection from './user_selection';

const getTime = (str: string) => {
  const local = new Date(str);
  const hour = local.getHours();
  const min = local.getMinutes();
  const time = (hour + min / 60);

  return time;
};

const countAvg = (list) => {
  let sum = 0;
  list.forEach((element) => {
    sum += element;
  });

  return sum / list.length;
};

const getCheckInOutTime = (list) => {

  const checkTimes: number[][] = [];
  const groupByDate = new Map();
  if (!list || list.length === 0) {
    return checkTimes;
  }
  for (const iterator of list) {
    if (iterator == null) {
      continue;
    }
    const date = new Date(new Date(iterator).setHours(0, 0, 0, 0)).getTime();
    if (groupByDate[date] == null) {
      groupByDate[date] = [getTime(iterator)];
      continue;
    }
    groupByDate[date].push(getTime(iterator));
  }

  const keyOfGroupByDate = Object.keys(groupByDate);

  keyOfGroupByDate.forEach((key) => {
    checkTimes.push([Number(key), countAvg(groupByDate[key])]);
  });

  return checkTimes;
};

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
  const checkIns = statistics.checkInCheckOuts.map((element) => element?.checkInAt);

  const checkOuts = statistics.checkInCheckOuts.map((element) => element?.checkOutAt);

  const data = {

    series: [{
      name: 'Check In',
      data: getCheckInOutTime(checkIns),
    }, {
      name: 'Check Out',
      data: getCheckInOutTime(checkOuts),
    }],
    chart: {
      type: 'area',
      height: 100,
      foreColor: '#424242',
      stacked: false,
      dropShadow: {
        enabled: true,
        enabledSeries: [0],
        top: -2,
        left: 2,
        blur: 5,
        opacity: 0.06,
      },
    },
    colors: ['#00E396', '#0090FF'],
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
      strokeColor: '#424242',
      strokeWidth: 3,
      strokeOpacity: 1,
      fillOpacity: 1,
      hover: {
        size: 6,
      },
    },
    xaxis: {
      type: 'datetime',
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        offsetX: 0,
        offsetY: 0,
        formatter: (val) => Math.floor(val),
      },
      tooltip: {
        enabled: true,
      },
      min: 0,
      max: 24,
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy',
      },
      y: {
        formatter: (value) => {
          const hour = Math.floor(value);
          const minutes = Math.floor((value - hour) * 60);
          if (minutes < 10) {
            return `${hour}h0${minutes}`;
          }

          return `${hour}h${minutes}`;
        },
      },

    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
    },
    fill: {
      type: 'solid',
      fillOpacity: 0.7,
    },
  };

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
