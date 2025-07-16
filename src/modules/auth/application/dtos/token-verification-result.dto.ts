import { JwtPayload } from '../ports/token.service';

export interface TokenVerificationResult {
  valid: boolean;
  payload?: JwtPayload;
  expired?: boolean;
  userId?: string;
  email?: string;
}
