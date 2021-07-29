import axios from 'axios'
import { config } from 'helpers/get_config'
import { Token } from 'helpers/type'
import { GetUserData } from 'pages/login/logic/login_actions'
import { updateAccountState } from './account_actions'

interface SaveUserInfo {
  phoneNumber?: string
  lastName?: string
  gender?: string
  dob?: string
}

export const saveUserInfo = (data: SaveUserInfo) => async (dispatch, getState) => {
  try {
    const userID = getState()?.userInfo?.userID
    const extendedProfile = getState()?.userInfo?.extendedProfile
    const token: Token =  localStorage.getItem('access_token')

    if (!data || !userID) {

      return
    }

    dispatch(updateAccountState({ loading: true }))

    const res = await axios.put(
      `${config.BASE_URL}/extendedUsers/${userID}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

    dispatch(GetUserData({
      extendedProfile: {
        ...extendedProfile,
        ...res?.data,
      },
    }))
    dispatch(updateAccountState({ loading: false }))
  } catch (error) {
    dispatch(updateAccountState({ loading: false }))
  }
}
