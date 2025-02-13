export interface ServerResponse<T> {
  resData: T | null;
  resError: string | null;
}
