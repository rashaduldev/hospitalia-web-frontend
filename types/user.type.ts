import { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import { Speciality } from "./speciality.type";

export type PhoneInputProps<T extends FieldValues> = {
  control: Control<T>;
  countrycode: Path<T>;
  required?: string;
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
  success: boolean;
  status: "success" | "error";
  message: string;
  payload: T | null;
  error?: string | null;
  statusCode?: number;
};

export interface Paginated<T> {
  content: T[];
  page: number;
  limit: number;
  total: number;
  totalElements: number;
  totalPages: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
}

export type RegisterUser = {
  firstName: string;
  lastName?: string;
  gender: string;
  userType: string;
  email: string;
  dateOfBirth?: string;
  countryCode: string;
  mobileNumber: string;
  password: string;
  profileImage?: string;
  professionalInfoRequest: {
    designation: string;
    specialityId: number[];
    onmsRegistrationNumber: string;
    professionalStatement?: string;
  };
};

export type NewUser = {
  firstName: string;
  lastName?: string;
  gender: string;
  userType: string;
  email: string;
  dateOfBirth?: string;
  countryCode: string;
  mobileNumber: string;
  password: string;
  userId: number;
  profileImage?: string;
  professionalInfoRequest: {
    designation: string;
    specialities?: Speciality[];
    specialityId: number[];
    departments?: string;
    departmentId?: number[];
    fileObjectId?: number;
    workPhoneNumber?: string;
    onmsRegistrationNumber: string;
    professionalStatement?: string;
  };
};

export type LoginRequestData = {
  countryCode: string;
  phoneNumber: string;
  password: string;
};

export type Role = {
  roleName: string;
  roleType?: string;
};

export type User = {
  id: number;
  roles: Role[];
  userType: string | null;
  userDetails?: {
    id?: number;
    firstName?: string;
    lastName?: string;
  } | null;
};

export type LoginResponseData = {
  accessToken?: string;
  refreshToken?: string;
  userId?: number;
  user?: User;
};
