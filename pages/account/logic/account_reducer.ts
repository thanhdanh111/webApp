import { AccountActionTypes } from './account_actions'
import { Notification } from 'helpers/type'

interface AccountValue {
  name: string
  email: string
  phoneNumber: string
  address: string
  country: string
  region: string
  city: string
  zipCode: string
  about: string
  isPublicProfile: boolean
  currentTabIndex: number
  accountNotifications: Notification[]
}

const initialState: AccountValue = {
  name: 'Account UI',
  email: 'tuan@company.cc',
  phoneNumber: '123456789',
  address: '',
  country: 'VietNam',
  region: '+84',
  about: '',
  city: 'Ho Chi Minh',
  zipCode: '70000',
  isPublicProfile: false,
  currentTabIndex: 0,
  accountNotifications: [],
}

export type AccountStateType = AccountValue

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case AccountActionTypes.saveAccountInfo:
      return {
        ...state,
        ...action,
      }
    case AccountActionTypes.publicProfile:
      return {
        ...state,
        isPublicProfile: !state?.isPublicProfile,
      }
    case AccountActionTypes.ChangeCurrentIndexAccountTabs:
      return {
        ...state,
        currentTabIndex: action.currentIndex,
      }
    default:
      return state
  }
}

export default accountReducer
