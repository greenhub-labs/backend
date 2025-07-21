// DDD Clean Architecture modules integration in progress
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { CropsModule } from './modules/crops/crops.module';
import { FarmsModule } from './modules/farms/farms.module';
import { PlotsModule } from './modules/plots/plots.module';
import { UsersModule } from './modules/users/users.module';
import { StartupCheckService } from './shared/application/services/startup-check.service';
import { SharedModule } from './shared/shared.module';

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
    PlotsModule,
    CropsModule,
  ],
  providers: [StartupCheckService],
})
export class AppModule {}
