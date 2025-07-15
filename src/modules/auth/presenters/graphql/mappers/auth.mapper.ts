import { Auth } from '../../../domain/entities/auth.entity';
import { AuthPayload } from '../dtos/responses/auth-payload.response.dto';
import { UserMapper } from '../../../../users/presenters/graphql/mappers/user.mapper';

export class AuthMapper {
  /**
   * Maps an Auth domain entity to an AuthPayload DTO
   * Converts all value objects to primitives for GraphQL serialization
   * @param auth - Auth domain entity
   * @returns AuthPayload with all value objects as primitives
   */
  static fromDomain(
    auth: Auth & { accessToken?: string; refreshToken?: string; user?: any },
  ): AuthPayload {
    return {
      accessToken: (auth as any).accessToken,
      refreshToken: (auth as any).refreshToken,
      user: auth.user ? UserMapper.toResponseDto(auth.user) : undefined,
    } as AuthPayload;
  }
}
