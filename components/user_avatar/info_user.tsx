import { Avatar } from '@material-ui/core'
import { Profile } from 'helpers/type'
import React from 'react'

interface PropInitial {
  style: string
  alt?: string
  user: Profile
}

const UserAvatar = (props: PropInitial) => {
  const { style, alt, user }: PropInitial = props
  const userName = `${user?.firstName} ${user?.lastName}`
  const textAlt = alt ? alt : userName

  return (
    <Avatar alt={textAlt} src={user?.profilePhoto} className={style} />
  )
}
export default (UserAvatar)
