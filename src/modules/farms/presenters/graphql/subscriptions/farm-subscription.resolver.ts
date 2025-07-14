import { Resolver, Subscription } from '@nestjs/graphql';
import { FarmResponseDto } from '../dtos/responses/farm.response.dto';

@Resolver(() => FarmResponseDto)
export class FarmsSubscriptionResolver {
  @Subscription(() => FarmResponseDto, {
    name: 'farmsCreated',
    filter: (payload, variables) => true, // Add your filter logic
  })
  farmsCreated() {
    // Implement your subscription logic here
    return {};
  }
}
