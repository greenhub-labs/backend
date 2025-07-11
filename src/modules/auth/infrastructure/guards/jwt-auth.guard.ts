import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  SetMetadata,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { Inject } from '@nestjs/common';
import {
  TokenService,
  TOKEN_SERVICE_TOKEN,
} from '../../application/ports/token.service';
import { AccessTokenValueObject } from '../../domain/value-objects/access-token/access-token.value-object';

/**
 * Metadata key for public routes
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator to mark routes as public (skip authentication)
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/**
 * JWT Authentication Guard for GraphQL resolvers
 * Validates JWT tokens and extracts user information
 *
 * @author GreenHub Labs
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(TOKEN_SERVICE_TOKEN)
    private readonly tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Get GraphQL context
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext();

    // Extract token from Authorization header
    const token = this.extractTokenFromHeader(req);
    if (!token) {
      throw new UnauthorizedException('Access token is required');
    }

    try {
      // Validate the token
      const accessToken = AccessTokenValueObject.create(token);
      const payload = await this.tokenService.verifyAccessToken(accessToken);

      // Attach user information to request
      req.user = {
        userId: payload.sub,
        email: payload.email,
        sessionId: payload.sessionId,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  /**
   * Extracts JWT token from Authorization header
   * @param request - HTTP request object
   * @returns Token string or null if not found
   */
  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers?.authorization;
    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
