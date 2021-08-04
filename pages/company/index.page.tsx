import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'redux/reducers_registration'
// import { useSnackbar, WithSnackbarProps } from 'notistack'
// import { updateCompanyNotifications } from './logic/company_actions'
// import { CompanyStateType } from './logic/company_reducer'
import ConnectSlackTabUi from './UI/connect_slack_tab'
import CompanyDetailTab from './UI/company_detail'
import { Avatar, Grid } from '@material-ui/core'

const CompanyPage = () => {
  // const { companyNotifications  }: CompanyStateType  = useSelector((state: RootState) => state.company)
  const userInfo  = useSelector((state: RootState) => state?.userInfo)
  // const dispatch = useDispatch()
  // const { enqueueSnackbar }: WithSnackbarProps = useSnackbar()
  const photoNameCompany = userInfo?.currentCompany?.name?.charAt(0)
  const [img, setImg] = useState(true)

  // useEffect(pushNotification, [companyNotifications])

  // function pushNotification() {

  //   if (companyNotifications && companyNotifications.length) {
  //     for (const notification of companyNotifications) {
  //       if (!notification) {
  //         continue
  //       }

  //       enqueueSnackbar(notification.message, { variant: notification['variant'] })
  //     }

  //     dispatch(updateCompanyNotifications({ notifications: [] }))
  //   }

  //   return
  // }

  return (
    <>
      <Grid className='company-page'>
        <Grid className='company-photo' sm={3}>
          { (userInfo?.currentCompany?.photos?.[0] && img) ?
            <img
              src={userInfo?.currentCompany?.photos[0]}
              className='img-company'
              onError={() => setImg(false)}
            /> :
            <Avatar
              variant='rounded'
              className='img-company'
            >
              {photoNameCompany}
            </Avatar>
          }
        </Grid>
        <Grid className='company-information' sm={9}>
          <CompanyDetailTab/>
          <ConnectSlackTabUi />

        </Grid>
      </Grid>
    </>
  )
}

export default CompanyPage
