import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../../../shared/infrastructure/prisma/prisma.module';
import { RedisModule } from '../../../shared/infrastructure/redis/redis.module';

// Repository implementations
import { AuthPrismaRepository } from './persistance/prisma/repositories/auth-prisma.repository';
import { AuthRedisCacheRepository } from './cache/redis/repositories/auth-redis-cache.repository';

// Service implementations
import { BcryptHashingService } from './services/bcrypt-hashing.service';
import { JwtTokenService } from './services/jwt-token.service';

// Guards
import { JwtAuthGuard } from './guards/jwt-auth.guard';

// Tokens for dependency injection
import { AUTH_REPOSITORY_TOKEN } from '../application/ports/auth.repository';
import { AUTH_CACHE_REPOSITORY_TOKEN } from '../application/ports/auth-cache.repository';
import { HASHING_SERVICE_TOKEN } from '../application/ports/hashing.service';
import { TOKEN_SERVICE_TOKEN } from '../application/ports/token.service';
import { SharedInfrastructureModule } from 'src/shared/infrastructure/shared-infrastructure.module';

/**
 * AuthInfrastructureModule
 * Infrastructure layer for Auth (DDD Clean Architecture)
 * Provides implementations for all application ports
 *
 * @author GreenHub Labs
 */
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(
          'JWT_ACCESS_SECRET',
          'default-secret',
        ),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    // Repository implementations
    {
      provide: AUTH_REPOSITORY_TOKEN,
      useClass: AuthPrismaRepository,
    },
    {
      provide: AUTH_CACHE_REPOSITORY_TOKEN,
      useClass: AuthRedisCacheRepository,
    },

    // Service implementations
    {
      provide: HASHING_SERVICE_TOKEN,
      useClass: BcryptHashingService,
    },
    {
      provide: TOKEN_SERVICE_TOKEN,
      useClass: JwtTokenService,
    },

    // Guards
    JwtAuthGuard,
  ],
  exports: [
    AUTH_REPOSITORY_TOKEN,
    AUTH_CACHE_REPOSITORY_TOKEN,
    HASHING_SERVICE_TOKEN,
    TOKEN_SERVICE_TOKEN,
    JwtAuthGuard,
  ],
})
export class AuthInfrastructureModule {}
