import { Speciality } from "./speciality.type";

export type HospitalInfo = {
  userId: number;
  hospitalName?: string | null;
  email: string;
  phoneNumber?: string | null;
  hospitalType?: string | null;
  workPhoneNumber?: string | null;
  websiteUrl?: string | null;
  numberOfBeds?: number | null;
  foundedYear?: number | null;
  professionalInfoResponse?: {
    designation?: string | null;
    specialities?: Speciality[];
    departments?: any[];
    fileObjectId?: string | null;
    workPhoneNumber?: string | null;
    professionalStatement?: string | null;
    onmsregistrationNumber?: string | null;
  };
};
