import { Notification } from 'helpers/type'
import { CompanyActionTypes } from './company_actions'

interface CompanyValue {
  slackToken: string
  onSendingToken: boolean
  companyNotifications: Notification[]
}

const initialState: CompanyValue = {
  slackToken: '',
  onSendingToken: false,
  companyNotifications: [],
}

export type CompanyStateType = CompanyValue

const companyReducer = (state = initialState, action) => {
  switch (action.type) {
    case CompanyActionTypes.FillingToken:

      return {
        ...state,
        ...action.data,
      }
    case CompanyActionTypes.UpdateOnSendingToken:
      if (!action.loading) {
        state.slackToken = ''
      }

      return {
        ...state,
        onSendingToken: action.loading,
        companyNotifications: action.notifications ?? [],
      }
    case CompanyActionTypes.ChangeCurrentIndexAccountTabs:
      return {
        ...state,
        currentTabIndex: action.currentIndex,
      }
    // case CompanyActionTypes.UpdateCompanyNotifications:
    //   return {
    //     ...state,
    //     companyNotifications: action.notifications,
    //   }
    default:
      return state
  }
}

export default companyReducer
