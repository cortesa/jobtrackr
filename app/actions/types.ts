export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; data?: undefined };

export function success<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function failure(message: string): ActionResult<never> {
  return { ok: false, error: message };
}
