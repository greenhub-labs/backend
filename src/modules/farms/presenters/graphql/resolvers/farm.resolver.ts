import { UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { AssignPlotToFarmCommand } from 'src/modules/farms/application/commands/assign-plot-to-farm/assign-plot-to-farm.command';
import { AssignUserToFarmCommand } from '../../../application/commands/assign-user-to-farm/assign-user-to-farm.command';
import { CreateFarmCommand } from '../../../application/commands/create-farm/create-farm.command';
import { DeleteFarmCommand } from '../../../application/commands/delete-farm/delete-farm.command';
import { UpdateFarmCommand } from '../../../application/commands/update-farm/update-farm.command';
import { GetAllFarmsQuery } from '../../../application/queries/get-all-farms/get-all-farms.query';
import { GetFarmByIdQuery } from '../../../application/queries/get-farm-by-id/get-farm-by-id.query';
import { AssignPlotToFarmRequestDto } from '../dtos/requests/assign-plot-to-farm.request.dto';
import { AssignUserToFarmRequestDto } from '../dtos/requests/assign-user-to-farm.request.dto';
import { CreateFarmRequestDto } from '../dtos/requests/create-farm.request.dto';
import { DeleteFarmRequestDto } from '../dtos/requests/delete-farm.request.dto';
import { GetFarmByIdRequestDto } from '../dtos/requests/get-farm-by-id.request.dto';
import { UpdateFarmRequestDto } from '../dtos/requests/update-farm.request.dto';
import { FarmResponseDto } from '../dtos/responses/farm.response.dto';
import { FarmMapper } from '../mappers/farm.mapper';

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
    const result = await this.queryBus.execute(new GetFarmByIdQuery(input.id));
    return FarmMapper.fromDomain(result);
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
        userId: input.userId,
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
    return await this.commandBus.execute(new DeleteFarmCommand(input.id));
  }

  @Mutation(() => FarmResponseDto, {
    name: 'assignUserToFarm',
    description: 'Assign a user to a farm',
  })
  async assignUserToFarm(
    @Args('input') input: AssignUserToFarmRequestDto,
  ): Promise<FarmResponseDto> {
    const { farm, members } = await this.commandBus.execute(
      new AssignUserToFarmCommand(input.farmId, input.userId, input.role),
    );
    return FarmMapper.fromDomain({ farm, members, plots: [] });
  }

  @Mutation(() => FarmResponseDto, {
    name: 'assignPlotToFarm',
    description: 'Assign a plot to a farm',
  })
  async assignPlotToFarm(
    @Args('input') input: AssignPlotToFarmRequestDto,
  ): Promise<FarmResponseDto> {
    const { farm, members, plots } = await this.commandBus.execute(
      new AssignPlotToFarmCommand(input.farmId, input.plotId),
    );
    return FarmMapper.fromDomain({ farm, members, plots });
  }
}
