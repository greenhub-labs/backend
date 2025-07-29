import { UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { GetPlotsByFarmIdQuery } from 'src/modules/plots/application/queries/get-plots-by-farm-id/get-plots-by-farm-id.query';
import { CreatePlotCommand } from '../../../application/commands/create-plot/create-plot.command';
import { DeletePlotCommand } from '../../../application/commands/delete-plot/delete-plot.command';
import { UpdatePlotCommand } from '../../../application/commands/update-plot/update-plot.command';
import { GetAllPlotsQuery } from '../../../application/queries/get-all-plots/get-all-plots.query';
import { GetPlotByIdQuery } from '../../../application/queries/get-plot-by-id/get-plot-by-id.query';
import { CreatePlotRequestDto } from '../dtos/requests/create-plot.request.dto';
import { DeletePlotRequestDto } from '../dtos/requests/delete-plot.request.dto';
import { GetPlotByIdRequestDto } from '../dtos/requests/get-plot-by-id.request.dto';
import { GetPlotsByFarmIdRequestDto } from '../dtos/requests/get-plots-by-farm-id.request.dto';
import { UpdatePlotRequestDto } from '../dtos/requests/update-plot.request.dto';
import { PlotResponseDto } from '../dtos/responses/plot.response.dto';
import { PlotMapper } from '../mappers/plot.mapper';

@Resolver(() => PlotResponseDto)
@UseGuards(JwtAuthGuard)
export class PlotResolver {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Query(() => PlotResponseDto, {
    name: 'getPlotById',
    description: 'Get plot information by ID (requires authentication)',
  })
  async getPlotById(
    @Args('input') input: GetPlotByIdRequestDto,
  ): Promise<PlotResponseDto> {
    const result = await this.queryBus.execute(new GetPlotByIdQuery(input.id));
    return PlotMapper.fromDomain(result);
  }

  @Query(() => [PlotResponseDto], {
    name: 'getAllPlots',
    description: 'Get all plots (requires authentication)',
  })
  async getAllPlots(): Promise<PlotResponseDto[]> {
    const results = await this.queryBus.execute(new GetAllPlotsQuery());
    return results.map((result) => PlotMapper.fromDomain(result));
  }

  @Query(() => [PlotResponseDto], {
    name: 'getPlotsByFarmId',
    description: 'Get all plots by farm ID (requires authentication)',
  })
  async getPlotsByFarmId(
    @Args('input') input: GetPlotsByFarmIdRequestDto,
  ): Promise<PlotResponseDto[]> {
    const results = await this.queryBus.execute(
      new GetPlotsByFarmIdQuery(input.farmId),
    );
    return results.map((result) => PlotMapper.fromDomain(result));
  }

  @Mutation(() => PlotResponseDto, {
    name: 'createPlot',
    description: 'Create a new plot',
  })
  async createPlot(
    @Args('input') input: CreatePlotRequestDto,
  ): Promise<PlotResponseDto> {
    const result = await this.commandBus.execute(
      new CreatePlotCommand({
        name: input.name,
        description: input.description,
        width: input.width,
        length: input.length,
        height: input.height,
        unitMeasurement: input.unitMeasurement,
        soilType: input.soilType,
        soilPh: input.soilPh,
        status: input.status,
        farmId: input.farmId,
      }),
    );
    return PlotMapper.fromDomain(result);
  }

  @Mutation(() => PlotResponseDto, {
    name: 'updatePlot',
    description: 'Update an existing plot',
  })
  async updatePlot(
    @Args('input') input: UpdatePlotRequestDto,
  ): Promise<PlotResponseDto> {
    const result = await this.commandBus.execute(
      new UpdatePlotCommand({
        id: input.id,
        name: input.name,
        description: input.description,
        width: input.width,
        length: input.length,
        height: input.height,
        unitMeasurement: input.unitMeasurement,
        soilType: input.soilType,
        soilPh: input.soilPh,
        status: input.status,
      }),
    );
    return PlotMapper.fromDomain(result);
  }

  @Mutation(() => Boolean, {
    name: 'deletePlot',
    description: 'Delete a plot by ID',
  })
  async deletePlot(
    @Args('input') input: DeletePlotRequestDto,
  ): Promise<boolean> {
    return await this.commandBus.execute(new DeletePlotCommand(input.id));
  }
}
