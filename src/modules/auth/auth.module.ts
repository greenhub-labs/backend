import { Module } from '@nestjs/common';
import { AuthDomainModule } from './domain/auth-domain.module';
import { AuthApplicationModule } from './application/auth-application.module';
import { AuthInfrastructureModule } from './infrastructure/auth-infrastructure.module';
import { AuthPresentersModule } from './presenters/auth-presenters.module';

/**
 * AuthModule
 * Main orchestrator for the Auth bounded context (DDD Clean Architecture)
 * Imports all layers: Domain, Application, Infrastructure, Presenters
 *
 * @author GreenHub Labs
 */
@Module({
  imports: [
    AuthDomainModule,
    AuthApplicationModule,
    AuthInfrastructureModule,
    AuthPresentersModule,
  ],
  exports: [
    AuthApplicationModule,
    AuthPresentersModule,
    AuthInfrastructureModule, // Export for JWT guard usage in other modules
  ],
})
export class AuthModule {}
