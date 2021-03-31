import { Grid } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import Graph from './graph';
import StatisticsCard from './statistics_card';
import StatisticsTable from './statistics_table';
import UserSelection from './user_selection';
interface DataType {
  title: string;
}

type BodyProps = DataType;
const StatisticsUi: FunctionComponent<BodyProps> = () => {
  return (
    <div className='statistics-page'>
      <div className='statistics-header'>
        <Grid className='statistics-card-grid' container>
          <Grid item xs={12} sm={3}>
            <StatisticsCard title='Traffic' numTitle='350,879' variation={3.48} lastSync='last month' />
          </Grid>
          <Grid item xs={12} sm={3}>
            <StatisticsCard title='New User' numTitle='2,356' variation={-3.48} lastSync='last week' />
          </Grid>
          <Grid item xs={12} sm={3}>
            <StatisticsCard title='Sales' numTitle='924' variation={4} lastSync='yesterday' />
          </Grid>
          <Grid item xs={12} sm={3}>
            <StatisticsCard title='Performance' numTitle='49,65%' variation={12} lastSync='' />
          </Grid>
        </Grid>
      </div>
      <div className='statistics-body'>
        <Grid container justify='center' >
          <Grid item xs={7} >
            <Graph />
          </Grid>
          <Grid item xs={4} justify='center'  >
            <UserSelection />
          </Grid>
        </Grid>
        <Grid container justify='center'>
          <Grid item xs={7} >
            <StatisticsTable />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
export default StatisticsUi;
