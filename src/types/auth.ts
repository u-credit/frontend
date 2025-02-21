export type UserRole = 'user' | 'admin';

export interface User {
  email: string;
  roles: UserRole[];
}