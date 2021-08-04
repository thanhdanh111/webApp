import { Box, Typography, Table, TableBody, TableRow, TableCell, Container } from '@material-ui/core'
import { Company } from 'helpers/type'
import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'redux/reducers_registration'

const CompanyDetailTab = () => {

  const userInfo  = useSelector((state: RootState) => state?.userInfo)
  const company: Company = userInfo?.currentCompany
  const infoCompany = [
    {
      name: 'Email',
      value: company?.emails?.[0],
    },
    {
      name: 'Phone number',
      value: company?.phoneNumbers,
    },
    {
      name: 'Address',
      value: company?.address,
    },
    {
      name: 'Description',
      value: company?.description,
    },
  ]

  return (
    <Box className='info-detail-company'>
        <Container className='company-info'>
          <Typography
            variant='h4'
            className='company-name'
          >
            {company?.name ?? 'My Company'}
          </Typography>
          <div className='company-information-div'>
              <Table className='table-info-company'>
                <TableBody>
                  {infoCompany.map((info, index) => {
                    if (!info?.value?.length) {

                      return <> </>
                    }

                    return  (
                      <TableRow key={index} >
                        <TableCell className='info-cell-company label-info-company'>{info?.name}</TableCell>
                        <TableCell className='info-cell-company content-info-company'>{info?.value}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
          </div>
        </Container>
      </Box>
  )
}

export default (CompanyDetailTab)
