import { Resolver, Mutation, Query, Args, Context } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UseGuards } from '@nestjs/common';

// Commands
import { RegisterCommand } from '../../../application/commands/register/register.command';
import { LoginCommand } from '../../../application/commands/login/login.command';
import { RefreshTokenCommand } from '../../../application/commands/refresh-token/refresh-token.command';
import { LogoutCommand } from '../../../application/commands/logout/logout.command';

// Queries
import { MeQuery } from '../../../application/queries/me/me.query';
import { VerifyTokenQuery } from '../../../application/queries/verify-token/verify-token.query';

// DTOs
import { RegisterInput } from '../dtos/requests/register.request.dto';
import { LoginInput } from '../dtos/requests/login.request.dto';
import { AuthPayload } from '../dtos/responses/auth-payload.response.dto';
import { TokenVerificationResult } from '../dtos/responses/token-verification-result.response.dto';
import { UserResponseDto } from '../../../../users/presenters/graphql/dtos/responses/user.response.dto';
import { AuthMapper } from '../mappers/auth.mapper';
// import { MeResponseDto } from '../dtos/responses/me.response.dto';

// Guards and decorators
import {
  JwtAuthGuard,
  Public,
} from '../../../infrastructure/guards/jwt-auth.guard';
import { UserMapper } from 'src/modules/users/presenters/graphql/mappers/user.mapper';

/**
 * AuthResolver
 * GraphQL resolver for authentication operations
 * Implements all auth mutations and queries from issue #1
 *
 * @author GreenHub Labs
 */
@Resolver()
@UseGuards(JwtAuthGuard) // Apply JWT guard globally to this resolver
export class AuthResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Register a new user
   * @param input Registration data
   * @returns Authentication payload with tokens and user data
   */
  @Public() // Public mutation
  @Mutation(() => AuthPayload, {
    name: 'register',
    description: 'Register a new user account',
  })
  async register(@Args('input') input: RegisterInput): Promise<AuthPayload> {
    const command = new RegisterCommand(
      input.email,
      input.password,
      input.firstName,
      input.lastName,
      input.phone,
    );
    const result = await this.commandBus.execute(command);
    return AuthMapper.fromDomain(result);
  }

  /**
   * Login with email and password
   * @param input Login credentials
   * @param context GraphQL context for IP and user agent
   * @returns Authentication payload with tokens and user data
   */
  @Public() // Public mutation
  @Mutation(() => AuthPayload, {
    name: 'login',
    description: 'Authenticate user with email and password',
  })
  async login(
    @Args('input') input: LoginInput,
    @Context() context: any,
  ): Promise<AuthPayload> {
    const request = context.req;
    const command = new LoginCommand(
      input.email,
      input.password,
      request.ip || request.connection?.remoteAddress,
      request.headers?.['user-agent'],
    );
    const result = await this.commandBus.execute(command);
    return AuthMapper.fromDomain(result);
  }

  /**
   * Logout current user
   * @param context GraphQL context containing user info from JWT guard
   * @returns Success status
   */
  @Mutation(() => Boolean, {
    name: 'logout',
    description: 'Logout current user and record logout event',
  })
  async logout(@Context() context: any): Promise<boolean> {
    const user = context.req.user;
    const command = new LogoutCommand(
      user.userId,
      user.sessionId, // If available in JWT payload
      'manual',
      'user_action',
    );

    return this.commandBus.execute(command);
  }

  /**
   * Refresh access token using refresh token
   * @param refreshToken Valid refresh token
   * @returns New authentication payload with fresh tokens
   */
  @Public() // Public mutation
  @Mutation(() => AuthPayload, {
    name: 'refreshToken',
    description: 'Refresh access token using a valid refresh token',
  })
  async refreshToken(
    @Args('refreshToken') refreshToken: string,
  ): Promise<AuthPayload> {
    const command = new RefreshTokenCommand(refreshToken);
    const result = await this.commandBus.execute(command);
    return AuthMapper.fromDomain(result);
  }

  /**
   * Get current authenticated user
   * @param context GraphQL context containing user info from JWT guard
   * @returns Current user data (user info + auth info)
   */
  @Query(() => UserResponseDto, {
    name: 'me',
    description:
      'Get current authenticated user information (user + auth info)',
  })
  async me(@Context() context: any): Promise<UserResponseDto> {
    const user = context.req.user;
    const query = new MeQuery(user.userId);
    const result = await this.queryBus.execute(query);
    return UserMapper.fromDomain(result.user, result.email, result.phone);
  }

  /**
   * Verify JWT token validity
   * @param token JWT token to verify
   * @returns Token verification result
   */
  @Public() // Public query
  @Query(() => TokenVerificationResult, {
    name: 'verifyToken',
    description: 'Verify JWT token validity and decode payload',
  })
  async verifyToken(
    @Args('token') token: string,
  ): Promise<TokenVerificationResult> {
    const query = new VerifyTokenQuery(token);
    return this.queryBus.execute(query);
  }

  // TODO: Future mutations to implement
  // - changePassword(input: ChangePasswordInput!): Boolean!
  // - requestPasswordReset(email: String!): Boolean!
  // - resetPassword(token: String!, newPassword: String!): Boolean!
}
