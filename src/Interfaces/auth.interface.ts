import { User } from '.';

export interface AuthDto {
  user: { [key: string]: any };
  accessToken: string;
  refreshToken: string;
  tokenExpiration: number;
}

export interface FetchAccessTokenResponse {
  access_token: string;
  user: User;
}
