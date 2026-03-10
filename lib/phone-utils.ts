import { parsePhoneNumber } from "react-phone-number-input";

export const getCleanPhoneData = (fullValue: string) => {
  const parsed = parsePhoneNumber(fullValue || "");

  return {
    countryCode: parsed ? `+${parsed.countryCallingCode}` : "",
    number: parsed ? parsed.nationalNumber : fullValue,
  };
};
