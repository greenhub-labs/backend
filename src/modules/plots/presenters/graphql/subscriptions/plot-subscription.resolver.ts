import { Resolver, Subscription } from '@nestjs/graphql';
import { PlotResponseDto } from '../dtos/responses/plot.response.dto';

@Resolver(() => PlotResponseDto)
export class PlotsSubscriptionResolver {
  @Subscription(() => PlotResponseDto, {
    name: 'plotsCreated',
    filter: (payload, variables) => true, // Add your filter logic
  })
  plotsCreated() {
    // Implement your subscription logic here
    return {};
  }
}
