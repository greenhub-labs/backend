import { UserDetailsResult } from 'src/modules/users/application/dtos/user-details.result';

export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  user: UserDetailsResult;
}
