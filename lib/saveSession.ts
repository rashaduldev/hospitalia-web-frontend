import Cookies from "js-cookie";

export function saveSession(res: any) {
  Cookies.set("accessToken", res.payload.accessToken);
  Cookies.set("refreshToken", res.payload.refreshToken);
}