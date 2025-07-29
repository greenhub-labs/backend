import { UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { CreateCropCommand } from '../../../application/commands/create-crop/create-crop.command';
import { DeleteCropCommand } from '../../../application/commands/delete-crop/delete-crop.command';
import { UpdateCropCommand } from '../../../application/commands/update-crop/update-crop.command';
import { GetAllCropsQuery } from '../../../application/queries/get-all-crops/get-all-crops.query';
import { GetCropByIdQuery } from '../../../application/queries/get-crop-by-id/get-crop-by-id.query';
import { GetCropsByFarmIdQuery } from '../../../application/queries/get-crops-by-farm-id/get-crops-by-farm-id.query';
import { GetCropsByPlotIdQuery } from '../../../application/queries/get-crops-by-plot-id/get-crops-by-plot-id.query';
import { CreateCropRequestDto } from '../dtos/requests/create-crop.request.dto';
import { DeleteCropRequestDto } from '../dtos/requests/delete-crop.request.dto';
import { GetCropByIdRequestDto } from '../dtos/requests/get-crop-by-id.request.dto';
import { GetCropsByFarmIdRequestDto } from '../dtos/requests/get-crops-by-farm-id.request.dto';
import { UpdateCropRequestDto } from '../dtos/requests/update-crop.request.dto';
import { CropResponseDto } from '../dtos/responses/crop.response.dto';
import { CropMapper } from '../mappers/crop.mapper';

@Resolver(() => CropResponseDto)
@UseGuards(JwtAuthGuard)
export class CropResolver {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Query(() => CropResponseDto, {
    name: 'getCropById',
    description: 'Get crop information by ID (requires authentication)',
  })
  async getCropById(
    @Args('input') input: GetCropByIdRequestDto,
  ): Promise<CropResponseDto> {
    const result = await this.queryBus.execute(
      new GetCropByIdQuery(input.cropId),
    );
    return CropMapper.fromDomain(result);
  }

  @Query(() => [CropResponseDto], {
    name: 'getAllCrops',
    description: 'Get all crops (requires authentication)',
  })
  async getAllCrops(): Promise<CropResponseDto[]> {
    const results = await this.queryBus.execute(new GetAllCropsQuery());
    return results.map((result) => CropMapper.fromDomain(result));
  }

  @Query(() => [CropResponseDto], {
    name: 'getCropsByPlotId',
    description: 'Get all crops by plot ID (requires authentication)',
  })
  async getCropsByPlotId(
    @Args('plotId', { type: () => String }) plotId: string,
  ): Promise<CropResponseDto[]> {
    const results = await this.queryBus.execute(
      new GetCropsByPlotIdQuery(plotId),
    );
    return results.map((result) => CropMapper.fromDomain(result));
  }

  @Query(() => [CropResponseDto], {
    name: 'getCropsByFarmId',
    description: 'Get all crops by farm ID (requires authentication)',
  })
  async getCropsByFarmId(
    @Args('input') input: GetCropsByFarmIdRequestDto,
  ): Promise<CropResponseDto[]> {
    const results = await this.queryBus.execute(
      new GetCropsByFarmIdQuery(input.farmId),
    );
    return results.map((result) => CropMapper.fromDomain(result));
  }

  @Mutation(() => CropResponseDto, {
    name: 'createCrop',
    description: 'Create a new crop',
  })
  async createCrop(
    @Args('input') input: CreateCropRequestDto,
  ): Promise<CropResponseDto> {
    const result = await this.commandBus.execute(
      new CreateCropCommand({
        plotId: input.plotId,
        varietyId: input.varietyId,
        plantingDate: input.plantingDate
          ? new Date(input.plantingDate)
          : undefined,
        expectedHarvest: input.expectedHarvest
          ? new Date(input.expectedHarvest)
          : undefined,
        actualHarvest: input.actualHarvest
          ? new Date(input.actualHarvest)
          : undefined,
        quantity: input.quantity,
        status: input.status,
        plantingMethod: input.plantingMethod,
        notes: input.notes,
      }),
    );
    return CropMapper.fromDomain(result);
  }

  @Mutation(() => CropResponseDto, {
    name: 'updateCrop',
    description: 'Update an existing crop',
  })
  async updateCrop(
    @Args('input') input: UpdateCropRequestDto,
  ): Promise<CropResponseDto> {
    const result = await this.commandBus.execute(
      new UpdateCropCommand({
        id: input.id,
        plantingDate: input.plantingDate
          ? new Date(input.plantingDate)
          : undefined,
        expectedHarvest: input.expectedHarvest
          ? new Date(input.expectedHarvest)
          : undefined,
        actualHarvest: input.actualHarvest
          ? new Date(input.actualHarvest)
          : undefined,
        quantity: input.quantity,
        status: input.status,
        plantingMethod: input.plantingMethod,
        notes: input.notes,
      }),
    );
    return CropMapper.fromDomain(result);
  }

  @Mutation(() => Boolean, {
    name: 'deleteCrop',
    description: 'Delete a crop',
  })
  async deleteCrop(
    @Args('input') input: DeleteCropRequestDto,
  ): Promise<boolean> {
    await this.commandBus.execute(new DeleteCropCommand(input.cropId));
    return true;
  }
}
