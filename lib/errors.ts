export class SessionExpiredError extends Error {
  constructor(
    message = "Your session has expired. Please log in again."
  ) {
    super(message);
    this.name = "SessionExpiredError";
  }
}

export function assertApiSuccess<
  T extends { success: boolean; message: string; statusCode?: number }
>(res: T): T {
  if (!res.success) {
    if (res.statusCode === 403) throw new SessionExpiredError();
    throw new Error(res.message || "Something went wrong");
  }
  return res;
}
