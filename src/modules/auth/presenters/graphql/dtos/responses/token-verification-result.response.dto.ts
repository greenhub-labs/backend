import { ObjectType, Field } from '@nestjs/graphql';

/**
 * TokenVerificationResult DTO
 * Response type for token verification operations
 *
 * @author GreenHub Labs
 */
@ObjectType()
export class TokenVerificationResult {
  /**
   * Whether the token is valid
   */
  @Field(() => Boolean, { description: 'Whether the token is valid' })
  valid: boolean;

  /**
   * Whether the token is expired
   */
  @Field(() => Boolean, {
    nullable: true,
    description: 'Whether the token is expired',
  })
  expired?: boolean;

  /**
   * User ID from token payload
   */
  @Field(() => String, {
    nullable: true,
    description: 'User ID extracted from token',
  })
  userId?: string;

  /**
   * Email from token payload
   */
  @Field(() => String, {
    nullable: true,
    description: 'Email extracted from token',
  })
  email?: string;
}
