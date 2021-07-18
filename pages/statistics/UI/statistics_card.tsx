import React from 'react'
import { Card, CardContent, Typography, Grid } from '@material-ui/core'
import { ArrowDownward, ArrowUpward } from '@material-ui/icons'
interface DataType {
  title: string
  numTitle: string
  variation: number
  lastSync: string
}

type BodyProps = DataType

const StatisticsCard: React.FunctionComponent<BodyProps> = ({ title, numTitle, variation, lastSync }) => {
  const icon = () => {
    if (variation > 0) {
      return (<ArrowUpward className={'statistics-increase'} fontSize='small' />)
    }

    return (<ArrowDownward className={'statistics-decrease'} fontSize='small' />)
  }

  return (
    <Card className='page-card' style={{ borderRadius: 10 }} >
      <CardContent className='page-card-content'>
        <Grid container>
          <Grid item xs={6}>
            <Typography color='textSecondary' gutterBottom className='page-card-title'>
              {title.toUpperCase()}
            </Typography>
            <Typography className='page-card-numtitle' variant='h5' component='h3'>
              {numTitle}
            </Typography>
          </Grid>
        </Grid>
        <br />
        <div>
          {icon()}
          <Typography className={variation > 0 ? 'statistics-increase statistics-sub2' : 'statistics-decrease statistics-sub2'}>
            {Math.abs(variation).toString()}%
            </Typography>
          <Typography className='statistics-sub2' >  Since {lastSync}</Typography>
        </div>
      </CardContent>
    </Card>
  )
}
export default StatisticsCard
