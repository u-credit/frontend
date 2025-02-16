export interface AuthDto {
  user: { [key: string]: any };
  accessToken: string;
  refreshToken: string;
  tokenExpiration: number;
}

export interface UserEntity {
  id: string;
  username: string;
  email: string;
  role: string;
  faculty_id: string;
  department_id: string;
  curr2_id: string;
  curriculum_year: string;
}

export interface FetchAccessTokenResponse {
  access_token: string;
  user: UserEntity;
}
