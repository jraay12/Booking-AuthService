export interface JwtService<T = any> {
  sign(payload: T): string;
  verify(token: string): T;
}