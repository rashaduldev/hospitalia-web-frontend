import { Control, FieldErrors, FieldValues, Path } from "react-hook-form";

export type PhoneInputProps<T extends FieldValues> = {
  control: Control<T>;
  countrycode: Path<T>;
  mobileNumber: Path<T>;
  label?: string;
  errors?: FieldErrors<T>;
};

export type Country = {
  name: string;
  isoCode: string;
  dialCode: string;
  flag: string;
};

export type ApiResponse<T> = {
  error: any;
  success: boolean;
  message: string;
  payload: T | null;
  status: number;
};

export interface Paginated<T> {
  content: T[];
  page: number;
  limit: number;
  total: number;
}

export type RegisterRequestData = {
  firstName: string;
  lastName?: string;
  gender: string;
  userType: string;
  email?: string;
  dateOfBirth?: string;
  countryCode?: string;
  mobileNumber: string;
  password: string;

  professionalInfoRequest?: {
    designation: string;
    specialityId: number[];
    departmentId?: number[];
    fileObjectId?: number;
    workPhoneNumber?: string;
    onmsRegistrationNumber?: string;
    professionalStatement?: string;
  };
};

export type LoginRequestData = {
  countryCode?: string;
  phoneNumber: string;
  password: string;
};

export type Role = {
  roleName: string;
};

export type User = {
  id: number;
  roles: Role[];
  userType: string;
};

export type LoginResponseData = {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
  user?: User;
};
