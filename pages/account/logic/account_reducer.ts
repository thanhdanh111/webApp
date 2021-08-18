import { AccountActionTypes } from './account_actions'

export interface AccountValue {
  profilePhoto?: string
  email?: string
  lastName?: string
  gender?: string
  dob?: string
  address?: string
  loading?: boolean
  isValidDateOfBirth?: boolean
  isValidPhoneNumber?: boolean
}

const initialState: AccountValue = {
  isValidDateOfBirth: true,
  isValidPhoneNumber: true,
}

export type AccountStateType = AccountValue

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case AccountActionTypes.saveAccountInfo:
      return {
        ...state,
        ...action.data,
      }
    default:
      return state
  }
}

export default accountReducer
