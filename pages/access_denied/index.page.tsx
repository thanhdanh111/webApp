import React, { useEffect } from 'react'
import AccessDenied from './UI/access_denied'

const AccessPermission = () => {

  useEffect(() => {
    localStorage.removeItem('access_token')
  }, [])

  return (
    <React.Fragment>
      <AccessDenied />
    </React.Fragment>
  )
}

export default AccessPermission
