import { Grid } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import Graph from './graph';
import StatisticsCard from './statistics_card';
import StatisticsTable from './statistics_table';
interface DataType {
  title: string;
}

type BodyProps = DataType;
const StatisticsUi: FunctionComponent<BodyProps> = () => {
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
        <Grid container justify='center' >
          <Grid item xs={12} >
            <Graph />
          </Grid>
        </Grid>
        <Grid container justify='center'>
          <Grid item xs={12} >
            <StatisticsTable />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
export default StatisticsUi;
