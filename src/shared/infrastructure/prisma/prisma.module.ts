import { Global, Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaModule
 * Shared infrastructure module that provides a singleton PrismaClient instance for database access.
 */
@Global()
@Module({
  providers: [
    {
      provide: PrismaClient,
      useValue: new PrismaClient(),
    },
  ],
  exports: [PrismaClient],
})
export class PrismaModule {}
