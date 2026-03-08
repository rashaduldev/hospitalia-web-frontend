export type PatientRegisterRequestData = {
  firstName: string;
  lastName?: string;
  gender: string;
  userType: string;
  email?: string;
  dateOfBirth?: string;
  countryCode?: string;
  mobileNumber: string;
  password: string;
};
