export interface UpdateAccountState {
  profilePhoto?: string
  email?: string
  phoneNumber?: string
  lastName?: string
  gender?: string
  dob?: string
  loading?: boolean
  isValidDateOfBirth?: boolean
  isValidPhoneNumber?: boolean
}

export enum AccountActionTypes {
  saveAccountInfo = 'saveAccountInfo',
}

export const updateAccountState = (data: UpdateAccountState) => {
  return {
    data,
    type: AccountActionTypes.saveAccountInfo,
  }
}
