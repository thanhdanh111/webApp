import { LoginAction } from './login_type_actions';

export const Login = (value: string) => {
  return {
    type: LoginAction.LOGIN,
    token: value,
  };
};
export const Logout = () => {
  return {
    type: LoginAction.LOGOUT,
  };
};
export const GetUserData = (res: object) => {
  return {
    type: LoginAction.GET_USER_DATA,
    payload: res,
  };
};
