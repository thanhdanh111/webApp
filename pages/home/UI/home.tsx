import React, { FunctionComponent } from 'react';
import { Button, Container, Typography, Grid } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { addVehicle } from '../logic/vehicle_actions';

interface DataType {
  title: string;
}

type BodyProps = DataType;

const HomeUi: FunctionComponent<BodyProps> = ({ title }) => {
  const vehicle = useSelector((state) => state.reducerVehicle);
  const dispatch = useDispatch();

  const FormVehicle = () => {
    return (
      <React.Fragment>
        <Grid item xs={2} className='test-home'>
          <Button color='primary' size='medium' onClick={() => dispatch(addVehicle('Bike'))}>
            Bike
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Typography variant='h4'>
            {vehicle.vehicle}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Button color='primary' size='medium' onClick={() => dispatch(addVehicle('Car'))}>
            Car
          </Button>
        </Grid>
      </React.Fragment>
    );
  };

  return (
    <main>
      <div className='hero-content'>
        <Container maxWidth='sm'>
          <Typography component='h1' variant='h2' align='center' color='textPrimary' gutterBottom>
            {title}
          </Typography>
        </Container>
      </div>
      <Container className='card-grid' maxWidth='md'>
        <div className='root'>
          <Grid container spacing={1}>
            <Grid container item xs={12} spacing={1}>
              <FormVehicle />
            </Grid>
          </Grid>
        </div>
      </Container>
    </main>
  );
};

export default HomeUi;
