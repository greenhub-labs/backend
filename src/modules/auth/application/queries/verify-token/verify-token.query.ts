/**
 * VerifyTokenQuery
 * Query for verifying and validating JWT tokens
 *
 * @author GreenHub Labs
 */
export class VerifyTokenQuery {
  /**
   * Creates a new VerifyTokenQuery
   * @param token - JWT token to verify
   * @param tokenType - Type of token to verify ('access' | 'refresh')
   */
  constructor(
    public readonly token: string,
    public readonly tokenType: 'access' | 'refresh' = 'access',
  ) {}
}
