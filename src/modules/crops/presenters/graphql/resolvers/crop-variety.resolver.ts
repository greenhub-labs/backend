import { UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { GetAllCropsVarietiesQuery } from 'src/modules/crops/application/queries/get-all-crops-varieties/get-all-crops-varieties.query';
import { GetCropVarietyByIdQuery } from 'src/modules/crops/application/queries/get-crop-variety-by-id/get-crop-variety-by-id.query';
import { GetCropVarietyByScientificNameQuery } from 'src/modules/crops/application/queries/get-crop-variety-by-scientific-name/get-crop-variety-by-scientific-name.query';
import { CreateCropVarietyCommand } from '../../../application/commands/create-crop-variety/create-crop-variety.command';
import { DeleteCropVarietyCommand } from '../../../application/commands/delete-crop-variety/delete-crop-variety.command';
import { UpdateCropVarietyCommand } from '../../../application/commands/update-crop-variety/update-crop-variety.command';
import { CreateCropVarietyRequestDto } from '../dtos/requests/create-crop-variety.request.dto';
import { DeleteCropVarietyRequestDto } from '../dtos/requests/delete-crop-variety.request.dto';
import { GetCropVarietyByScientificNameRequestDto } from '../dtos/requests/get-crop-variety-by-scientific-name.request.dto';
import { UpdateCropVarietyRequestDto } from '../dtos/requests/update-crop-variety.request.dto';
import { CropVarietyResponseDto } from '../dtos/responses/crop-variety.response.dto';
import { CropVarietyMapper } from '../mappers/crop-variety.mapper';

@Resolver(() => CropVarietyResponseDto)
@UseGuards(JwtAuthGuard)
export class CropVarietyResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => CropVarietyResponseDto, {
    name: 'getCropVarietyById',
    description: 'Get a crop variety by ID',
  })
  async getCropVarietyById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<CropVarietyResponseDto> {
    const result = await this.queryBus.execute(new GetCropVarietyByIdQuery(id));
    return CropVarietyMapper.fromDomain(result);
  }

  @Query(() => CropVarietyResponseDto, {
    name: 'getCropVarietyByScientificName',
    description: 'Get a crop variety by its scientific name',
  })
  async getCropVarietyByScientificName(
    @Args('input') input: GetCropVarietyByScientificNameRequestDto,
  ): Promise<CropVarietyResponseDto> {
    const result = await this.queryBus.execute(
      new GetCropVarietyByScientificNameQuery(input.scientificName),
    );
    return CropVarietyMapper.fromDomain(result);
  }

  @Query(() => [CropVarietyResponseDto], {
    name: 'getAllCropVarieties',
    description: 'Get all crop varieties',
  })
  async getAllCropVarieties(): Promise<CropVarietyResponseDto[]> {
    const result = await this.queryBus.execute(new GetAllCropsVarietiesQuery());
    return result.map(CropVarietyMapper.fromDomain);
  }

  @Mutation(() => CropVarietyResponseDto, {
    name: 'createCropVariety',
    description: 'Create a new crop variety',
  })
  async createCropVariety(
    @Args('input') input: CreateCropVarietyRequestDto,
  ): Promise<CropVarietyResponseDto> {
    const result = await this.commandBus.execute(
      new CreateCropVarietyCommand({
        ...input,
      }),
    );
    return CropVarietyMapper.fromDomain(result);
  }

  @Mutation(() => CropVarietyResponseDto, {
    name: 'updateCropVariety',
    description: 'Update an existing crop variety',
  })
  async updateCropVariety(
    @Args('input') input: UpdateCropVarietyRequestDto,
  ): Promise<CropVarietyResponseDto> {
    const result = await this.commandBus.execute(
      new UpdateCropVarietyCommand({
        ...input,
      }),
    );
    return CropVarietyMapper.fromDomain(result);
  }

  @Mutation(() => Boolean, {
    name: 'deleteCropVariety',
    description: 'Delete a crop variety by ID',
  })
  async deleteCropVariety(
    @Args('input') input: DeleteCropVarietyRequestDto,
  ): Promise<boolean> {
    return await this.commandBus.execute(
      new DeleteCropVarietyCommand(input.id),
    );
  }
}
