// DDD Clean Architecture modules integration in progress
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { StartupCheckService } from './shared/application/services/startup-check.service';
import { FarmsModule } from './modules/farms/farms.module';

@Module({
  imports: [
    // Core modules
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // GraphQL Configuration
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      introspection: true,
    }),
    CqrsModule,
    AuthModule,
    UsersModule,
    SharedModule,
    FarmsModule,
  ],
  providers: [StartupCheckService],
})
export class AppModule {}
