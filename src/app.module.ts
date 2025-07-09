import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

// Shared Kernel
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { EventBusModule } from './shared/infrastructure/event-bus/event-bus.module';

// Bounded Contexts
import { GardenModule } from './bounded-contexts/garden/garden.module';
import { ChickenCoopModule } from './bounded-contexts/chicken-coop/chicken-coop.module';
import { DeviceModule } from './bounded-contexts/device/device.module';
import { CommunicationModule } from './bounded-contexts/communication/communication.module';
import { UserModule } from './bounded-contexts/user/user.module';
import { EnergyModule } from './bounded-contexts/energy/energy.module';
import { AnalyticsModule } from './bounded-contexts/analytics/analytics.module';

@Module({
  imports: [
    // Core modules
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CqrsModule,

    // Shared infrastructure
    DatabaseModule,
    EventBusModule,

    // Bounded Contexts
    GardenModule,
    ChickenCoopModule,
    DeviceModule,
    CommunicationModule,
    UserModule,
    EnergyModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
