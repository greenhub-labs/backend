import { Global, Module } from '@nestjs/common';
import { SharedInfrastructureModule } from './infrastructure/shared-infrastructure.module';

@Global()
@Module({
  imports: [SharedInfrastructureModule],
  providers: [],
  exports: [SharedInfrastructureModule],
})
export class SharedModule {}
