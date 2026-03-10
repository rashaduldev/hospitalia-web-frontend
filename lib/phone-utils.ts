import { parsePhoneNumber } from "react-phone-number-input";

export const getCleanPhoneData = (fullPhoneNumber: string) => {
  const parsed = parsePhoneNumber(fullPhoneNumber);
  return {
    countryCode: parsed ? `+${parsed.countryCallingCode}` : "",
    phoneNumber: parsed ? parsed.nationalNumber : fullPhoneNumber,
  };
};
