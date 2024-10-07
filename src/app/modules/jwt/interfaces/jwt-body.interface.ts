import { AuthUserRole } from 'src/core/interfaces/auth.type';

export interface JwtBodyInterface {
  id: string;
  role: AuthUserRole;
  pic: string;
  username: string;
  email: string;
}
