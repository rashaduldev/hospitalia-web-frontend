import Cookies from "js-cookie";

export function saveSession(res: any) {
  const accessToken = res?.payload?.accessToken;
  const refreshToken = res?.payload?.refreshToken;

  if (!accessToken || !refreshToken) {
    throw new Error("Tokens missing from server response");
  }

  // Store JWT in secure cookies
  Cookies.set("accessToken", accessToken, { secure: true, sameSite: "strict" });
  Cookies.set("refreshToken", refreshToken, { secure: true, sameSite: "strict" });
}
