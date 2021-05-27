import { Box, Typography, Table, TableBody, TableRow, TableCell, Container } from '@material-ui/core';
import { Company } from 'helpers/type';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers_registration';

const CompanyDetailTab = () => {

  const authState  = useSelector((state: RootState) => state.auth);
  const company: Company = authState.extendedCompany?.companyID;
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
  ];

  return (
    <Box className='info-detail-company'>
        <Container className='company-info'>
          <Typography
            variant='h4'
            className='company-name'
          >
            {authState?.extendedCompany?.companyID?.name ?? 'My Company'}
          </Typography>
          <div className='company-information-div'>
              <Table className='table-info-company'>
                <TableBody>
                  {infoCompany.map((info, index) => (
                    <TableRow key={index} >
                      <TableCell className='info-cell-company label-info-company'>{info?.name}</TableCell>
                      <TableCell className='info-cell-company content-info-company'>{info?.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </div>
          <div className='company-information-description'>
          {(company?.description) ??
            <Typography className='company-description' component='span'>
            {company?.description}
            </Typography>}
          </div>
        </Container>
      </Box>
  );
};

export default (CompanyDetailTab);
