import { ObjectType, Field } from '@nestjs/graphql';
import { UserDetailsResponseDto } from 'src/modules/users/presenters/graphql/dtos/responses/user.response.dto';

/**
 * AuthPayload DTO
 * Response type for authentication operations (login, register, refresh)
 *
 * @author GreenHub Labs
 */
@ObjectType()
export class AuthPayload {
  /**
   * JWT access token
   */
  @Field(() => String, {
    description: 'JWT access token for API authentication',
  })
  accessToken: string;

  /**
   * JWT refresh token
   */
  @Field(() => String, {
    description: 'JWT refresh token for obtaining new access tokens',
  })
  refreshToken: string;

  /**
   * Authenticated user information
   */
  @Field(() => UserDetailsResponseDto, { description: 'User information' })
  user: UserDetailsResponseDto;
}
