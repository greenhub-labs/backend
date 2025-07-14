import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { CommandBus } from '@nestjs/cqrs';
import { GetFarmByIdRequestDto } from '../dtos/requests/get-farm-by-id.request.dto';
import { FarmResponseDto } from '../dtos/responses/farm.response.dto';
import { CreateFarmRequestDto } from '../dtos/requests/create-farm.request.dto';
import { UpdateFarmRequestDto } from '../dtos/requests/update-farm.request.dto';
import { DeleteFarmRequestDto } from '../dtos/requests/delete-farm.request.dto';
import { GetFarmByIdQuery } from '../../../application/queries/get-farm-by-id/get-farm-by-id.query';
import { GetAllFarmsQuery } from '../../../application/queries/get-all-farms/get-all-farms.query';
import { CreateFarmCommand } from '../../../application/commands/create-farm/create-farm.command';
import { UpdateFarmCommand } from '../../../application/commands/update-farm/update-farm.command';
import { DeleteFarmCommand } from '../../../application/commands/delete-farm/delete-farm.command';
import { FarmMapper } from '../mappers/farm.mapper';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';

@Resolver(() => FarmResponseDto)
@UseGuards(JwtAuthGuard)
export class FarmResolver {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Query(() => FarmResponseDto, {
    name: 'getFarmById',
    description: 'Get farm information by ID (requires authentication)',
  })
  async getFarmById(
    @Args('input') input: GetFarmByIdRequestDto,
  ): Promise<FarmResponseDto> {
    const farm = await this.queryBus.execute(new GetFarmByIdQuery(input.id));
    return FarmMapper.fromDomain(farm);
  }

  @Query(() => [FarmResponseDto], {
    name: 'getAllFarms',
    description: 'Get all farms (requires authentication)',
  })
  async getAllFarms(): Promise<FarmResponseDto[]> {
    const farms = await this.queryBus.execute(new GetAllFarmsQuery());
    return farms.map(FarmMapper.fromDomain);
  }

  @Mutation(() => FarmResponseDto, {
    name: 'createFarm',
    description: 'Create a new farm',
  })
  async createFarm(
    @Args('input') input: CreateFarmRequestDto,
  ): Promise<FarmResponseDto> {
    const farm = await this.commandBus.execute(
      new CreateFarmCommand({
        name: input.name,
        description: input.description,
        country: input.country,
        state: input.state,
        city: input.city,
        postalCode: input.postalCode,
        street: input.street,
        latitude: input.latitude,
        longitude: input.longitude,
        isActive: true,
      }),
    );
    return FarmMapper.fromDomain(farm);
  }

  @Mutation(() => FarmResponseDto, {
    name: 'updateFarm',
    description: 'Update an existing farm',
  })
  async updateFarm(
    @Args('input') input: UpdateFarmRequestDto,
  ): Promise<FarmResponseDto> {
    const farm = await this.commandBus.execute(
      new UpdateFarmCommand({
        id: input.id,
        name: input.name,
        description: input.description,
        country: input.country,
        state: input.state,
        city: input.city,
        postalCode: input.postalCode,
        street: input.street,
        latitude: input.latitude,
        longitude: input.longitude,
        isActive: input.isActive,
      }),
    );
    return FarmMapper.fromDomain(farm);
  }

  @Mutation(() => Boolean, {
    name: 'deleteFarm',
    description: 'Delete a farm by ID',
  })
  async deleteFarm(
    @Args('input') input: DeleteFarmRequestDto,
  ): Promise<boolean> {
    await this.commandBus.execute(new DeleteFarmCommand(input.id));
    return true;
  }
}
