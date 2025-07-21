import { UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { CreateCropVarietyCommand } from '../../../application/commands/create-crop-variety/create-crop-variety.command';
import { DeleteCropVarietyCommand } from '../../../application/commands/delete-crop-variety/delete-crop-variety.command';
import { UpdateCropVarietyCommand } from '../../../application/commands/update-crop-variety/update-crop-variety.command';
import { CreateCropVarietyRequestDto } from '../dtos/requests/create-crop-variety.request.dto';
import { DeleteCropVarietyRequestDto } from '../dtos/requests/delete-crop-variety.request.dto';
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

  // Queries para consultar variedades de cultivo (por ID, todas, etc.) pueden añadirse aquí
}
