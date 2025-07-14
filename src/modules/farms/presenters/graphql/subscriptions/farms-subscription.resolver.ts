import { Resolver, Subscription } from '@nestjs/graphql';
import { FarmsResponse } from '../dtos/responses/farms.response';

@Resolver(() => FarmsResponse)
export class FarmsSubscriptionResolver {
  @Subscription(() => FarmsResponse, {
    name: 'farmsCreated',
    filter: (payload, variables) => true, // Add your filter logic
  })
  farmsCreated() {
    // Implement your subscription logic here
    return {};
  }
} 