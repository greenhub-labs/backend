import { Module } from '@nestjs/common';
import { UsersDomainModule } from './domain/users-domain.module';
import { UsersApplicationModule } from './application/users-application.module';
import { UsersInfrastructureModule } from './infrastructure/users-infrastructure.module';
import { UsersPresentersModule } from './presenters/users.presenters.module';

/**
 * UsersModule
 * Main orchestrator for the Users bounded context (DDD Clean Architecture)
 */
@Module({
  imports: [
    UsersDomainModule,
    UsersApplicationModule,
    UsersInfrastructureModule,
    UsersPresentersModule,
  ],
  exports: [],
})
export class UsersModule {}
