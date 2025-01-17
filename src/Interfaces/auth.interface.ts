export interface AuthDto {
  user: { [key: string]: any };
  accessToken: string;
  refreshToken: string;
  tokenExpiration: number;
}
