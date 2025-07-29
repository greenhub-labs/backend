import { Resolver, Subscription } from '@nestjs/graphql';
import { CropResponseDto } from '../dtos/responses/crop.response.dto';

@Resolver(() => CropResponseDto)
export class CropsSubscriptionResolver {
  @Subscription(() => CropResponseDto, {
    name: 'cropsCreated',
    filter: (payload, variables) => true, // Add your filter logic
  })
  plotsCreated() {
    // Implement your subscription logic here
    return {};
  }
}
