import React, { FunctionComponent } from 'react'
import {
  Box, Table, TableBody, TableCell, TableContainer, TableRow, Typography, TableHead,
} from '@material-ui/core'

import { RootStateOrAny, useSelector } from 'react-redux'

const StatisticsTable: FunctionComponent = () => {
  const statistics = useSelector((state: RootStateOrAny) => state.statistics)
  const statisticsList = statistics.checkInCheckOuts

  return (
    <Box className='statistics-table'>
      <Typography className='table-title' >Detail Time</Typography>
      <TableContainer>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow >
              <TableCell className='table-header'>Index</TableCell>
              <TableCell className='table-header' align='center'>Date</TableCell>
              <TableCell className='table-header' align='center'>Check In Time</TableCell>
              <TableCell className='table-header' align='center'>Check Out Time</TableCell>
              <TableCell className='table-header' align='center'>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statisticsList.map((row, index) => {
              if (row?.checkInAt == null) {
                return <></>
              }
              const checkInAt = new Date(row.checkInAt)
              const checkOutAt = new Date(row.checkOutAt)

              return (
                <TableRow key={index}>
                  <TableCell component='th' scope='row'>
                    {index + 1}
                  </TableCell>
                  <TableCell align='center'>{checkInAt.toLocaleDateString()}</TableCell>
                  <TableCell align='center'>{checkInAt.toLocaleTimeString()}</TableCell>
                  <TableCell align='center'>{checkOutAt.toLocaleTimeString()}</TableCell>
                  <TableCell align='center'>{row.description}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>

  )
}

export default StatisticsTable
