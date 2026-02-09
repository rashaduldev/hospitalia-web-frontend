import { Control } from "react-hook-form";

export interface PhoneInputProps {
  control: Control<any>;
  nameCode: string;
  mobileNumber?: string;
  phoneNumber?:string;
  label?: string;
  error?: string;
}

export type Country = {
  name: string;
  isoCode: string;
  dialCode: string; 
  flag: string;
};