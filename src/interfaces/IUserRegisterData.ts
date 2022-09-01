export interface IUserRegisterData {
  firstName: string;
  firstSurname: string;
  profileImage?: string;
  userEmail: string;
  password: string;
}

export interface IUserLoginData {
  id: string;
  userEmail: string;
  password: string;
}
