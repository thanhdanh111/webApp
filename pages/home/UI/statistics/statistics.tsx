import { Box, Typography } from '@material-ui/core'
import dynamic from 'next/dynamic'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })
import { getGraphOptions } from 'helpers/get_statistics_data'
import React, { FunctionComponent, useEffect } from 'react'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import { limitStatistics } from 'pages/statistics/logic/statistics_actions'
import { getAllCheckInThunkAction } from 'pages/statistics/logic/statistics_reducer'

const CheckInCheckOutStatistics: FunctionComponent = () => {

  const dispatch = useDispatch()
  const statistics = useSelector((state: RootStateOrAny) => state.statistics)
  useEffect(() => {
    void fetchCheckinData()
  }, [])

  const fetchCheckinData = async () => {
    await Promise.all([
      dispatch(limitStatistics(7)),
      dispatch(getAllCheckInThunkAction()),
    ])
  }

  const data = getGraphOptions(statistics.checkInCheckOuts)

  return (
    <div className='statistics-dashboard'>
      <Box className='statistics-container shadow-container'>
        <Typography className='table-title' >Checkin-checkout This Week</Typography>
        <Chart options={data} series={data.series} />
      </Box>
    </div>
  )
}

export default CheckInCheckOutStatistics
