export interface BcryptService {
  hash(password: string, salt: number): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}