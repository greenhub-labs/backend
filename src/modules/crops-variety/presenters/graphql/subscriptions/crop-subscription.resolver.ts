import { Resolver, Subscription } from '@nestjs/graphql';
import { CropVarietyResponseDto } from '../dtos/responses/crop-variety.response.dto';

@Resolver(() => CropVarietyResponseDto)
export class CropsVarietySubscriptionResolver {
  @Subscription(() => CropVarietyResponseDto, {
    name: 'cropsVarietyCreated',
    filter: (payload, variables) => true, // Add your filter logic
  })
  cropsVarietyCreated() {
    // Implement your subscription logic here
    return {};
  }
}
