import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateFarmsInput } from '../dtos/requests/create-farms.input';
import { FarmsResponse } from '../dtos/responses/farms.response';
import { UpdateFarmsInput } from '../dtos/requests/update-farms.input';
import { DeleteFarmsInput } from '../dtos/requests/delete-farms.input';
@Resolver(() => FarmsResponse)
export class FarmsResolver {
  @Query(() => FarmsResponse, { name: 'getFarmsById' })
  getById(@Args('id', { type: () => String }) id: string): FarmsResponse {
    // Implement query logic here
    return { id } as any;
  }

  @Mutation(() => FarmsResponse, { name: 'createFarms' })
  create(@Args('input') input: CreateFarmsInput): FarmsResponse {
    // Implement mutation logic here
      return { id: input.id } as any;
  }

  @Mutation(() => FarmsResponse, { name: 'updateFarms' })
  update(@Args('input') input: UpdateFarmsInput): FarmsResponse {
    // Implement mutation logic here
    return { id: input.id } as any;
  }

  @Mutation(() => FarmsResponse, { name: 'deleteFarms' })
  delete(@Args('input') input: DeleteFarmsInput): FarmsResponse {
    // Implement mutation logic here
    return { id: input.id } as any;
  }
} 