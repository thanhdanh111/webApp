import axios from 'axios'
import { checkOnlyTrueInArray } from 'helpers/check_only_true'
import { checkValidDateTime } from 'helpers/check_valid_date_time'
import { checkValidPhonenumber } from 'helpers/check_valid_phone_number'
import { config } from 'helpers/get_config'
import { Token } from 'helpers/type'
import moment from 'moment'
import { GetUserData } from 'pages/login/logic/login_actions'
import { updateAccountState } from './account_actions'
import { AccountValue } from './account_reducer'

export interface SaveUserInfo {
  phoneNumber?: string
  address?: string
  gender?: string
  dob?: string
}

export const saveUserInfo = (data: SaveUserInfo, minDateOfBirth: Date, maxDateOfBirth: Date) => async (dispatch, getState) => {
  try {

    await Promise.all([
      dispatch(updateAccountState({ isValidDateOfBirth: true, isValidPhoneNumber: true })),
    ])
    const userID = getState()?.userInfo?.userID
    const extendedProfile = getState()?.userInfo?.extendedProfile
    const token: Token = localStorage.getItem('access_token')
    const { isValidDateOfBirth, isValidPhoneNumber }: AccountValue = getState().account
    let validDateOfBirth = isValidDateOfBirth
    let validPhoneNumber = isValidPhoneNumber

    const checkValidData = () => {
      const timeDateOfbirth = new Date(moment(data['dob']).format('YYYY-MM-DD'))
      if (!checkValidDateTime({ time: timeDateOfbirth, minDate: minDateOfBirth, maxDate: maxDateOfBirth })) {
        validDateOfBirth = false
        dispatch(updateAccountState({ isValidDateOfBirth: false }))
      }

      if (!checkValidPhonenumber(data['phoneNumber'])) {
        validPhoneNumber = false
        dispatch(updateAccountState({ isValidPhoneNumber: false }))
      }

      const isValidData = checkOnlyTrueInArray({
        conditionsArray: [
          !!validDateOfBirth,
          !!validPhoneNumber,
        ],
      })

      return isValidData
    }

    if (!data || !userID || !checkValidData()) {

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
