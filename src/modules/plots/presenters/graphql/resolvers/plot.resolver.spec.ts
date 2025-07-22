import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CreatePlotCommand } from 'src/modules/plots/application/commands/create-plot/create-plot.command';
import { DeletePlotCommand } from 'src/modules/plots/application/commands/delete-plot/delete-plot.command';
import { UpdatePlotCommand } from 'src/modules/plots/application/commands/update-plot/update-plot.command';
import { GetAllPlotsQuery } from 'src/modules/plots/application/queries/get-all-plots/get-all-plots.query';
import { GetPlotByIdQuery } from 'src/modules/plots/application/queries/get-plot-by-id/get-plot-by-id.query';
import { GetPlotsByFarmIdQuery } from 'src/modules/plots/application/queries/get-plots-by-farm-id/get-plots-by-farm-id.query';
import { PLOT_SOIL_TYPES } from 'src/modules/plots/domain/constants/plot-soil-types.constant';
import { PLOT_STATUS } from 'src/modules/plots/domain/constants/plot-status.constant';
import { PlotEntity } from 'src/modules/plots/domain/entities/plot.entity';
import { PlotDimensionValueObject } from 'src/modules/plots/domain/value-objects/plot-dimension/plot-dimension.value-object';
import { PlotIdValueObject } from 'src/modules/plots/domain/value-objects/plot-id/plot-id.value-object';
import { PlotNameValueObject } from 'src/modules/plots/domain/value-objects/plot-name/plot-name.value-object';
import { PlotSoilTypeValueObject } from 'src/modules/plots/domain/value-objects/plot-soil-type/plot-soil-type.value-object';
import { PlotStatusValueObject } from 'src/modules/plots/domain/value-objects/plot-status/plot-status.value-object';
import {
  UNIT_MEASUREMENT,
  UNIT_MEASUREMENT_CATEGORY,
} from 'src/shared/domain/constants/unit-measurement.constant';
import { CreatePlotRequestDto } from '../dtos/requests/create-plot.request.dto';
import { DeletePlotRequestDto } from '../dtos/requests/delete-plot.request.dto';
import { GetPlotByIdRequestDto } from '../dtos/requests/get-plot-by-id.request.dto';
import { GetPlotsByFarmIdRequestDto } from '../dtos/requests/get-plots-by-farm-id.request.dto';
import { UpdatePlotRequestDto } from '../dtos/requests/update-plot.request.dto';
import { PlotResponseDto } from '../dtos/responses/plot.response.dto';
import { PlotMapper } from '../mappers/plot.mapper';
import { PlotResolver } from './plot.resolver';

jest.mock('../mappers/plot.mapper');

// Mock the JwtAuthGuard
jest.mock('src/modules/auth/infrastructure/guards/jwt-auth.guard', () => ({
  JwtAuthGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn().mockReturnValue(true),
  })),
}));

describe('PlotResolver', () => {
  let resolver: PlotResolver;
  let queryBus: jest.Mocked<QueryBus>;
  let commandBus: jest.Mocked<CommandBus>;
  let plotMapper: jest.Mocked<typeof PlotMapper>;

  const validUuid = '123e4567-e89b-12d3-a456-426614174000';

  const mockPlot = new PlotEntity({
    id: new PlotIdValueObject(validUuid),
    name: new PlotNameValueObject('Test Plot'),
    description: 'A test plot',
    dimensions: new PlotDimensionValueObject(
      10,
      20,
      1,
      UNIT_MEASUREMENT.METERS,
    ),
    status: new PlotStatusValueObject(PLOT_STATUS.ACTIVE),
    soilType: new PlotSoilTypeValueObject(PLOT_SOIL_TYPES.SANDY),
    soilPh: 6.5,
    farmId: 'farm-123',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-02'),
  });

  const mockPlotResponse: PlotResponseDto = {
    id: validUuid,
    name: 'Test Plot',
    description: 'A test plot',
    dimensions: {
      width: 10,
      length: 20,
      height: 1,
      area: 200,
      perimeter: 60,
      volume: 200,
      unitMeasurement: UNIT_MEASUREMENT.METERS,
      unitMeasurementCategory: UNIT_MEASUREMENT_CATEGORY.METRIC,
    },
    status: PLOT_STATUS.ACTIVE,
    soilType: PLOT_SOIL_TYPES.SANDY,
    soilPh: 6.5,
    farmId: 'farm-123',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-02'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlotResolver,
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<PlotResolver>(PlotResolver);
    queryBus = module.get(QueryBus);
    commandBus = module.get(CommandBus);
    plotMapper = PlotMapper as jest.Mocked<typeof PlotMapper>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPlotById', () => {
    it('should return a plot by ID', async () => {
      const input: GetPlotByIdRequestDto = { id: validUuid };
      const queryResult = { plot: mockPlot };

      queryBus.execute.mockResolvedValue(queryResult);
      plotMapper.fromDomain.mockReturnValue(mockPlotResponse);

      const result = await resolver.getPlotById(input);

      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetPlotByIdQuery(validUuid),
      );
      expect(plotMapper.fromDomain).toHaveBeenCalledWith(mockPlot);
      expect(result).toEqual(mockPlotResponse);
    });
  });

  describe('getAllPlots', () => {
    it('should return all plots', async () => {
      const queryResult = [{ plot: mockPlot }];

      queryBus.execute.mockResolvedValue(queryResult);
      plotMapper.fromDomain.mockReturnValue(mockPlotResponse);

      const result = await resolver.getAllPlots();

      expect(queryBus.execute).toHaveBeenCalledWith(new GetAllPlotsQuery());
      expect(plotMapper.fromDomain).toHaveBeenCalledWith(mockPlot);
      expect(result).toEqual([mockPlotResponse]);
    });
  });

  describe('getPlotsByFarmId', () => {
    it('should return plots by farm ID', async () => {
      const input: GetPlotsByFarmIdRequestDto = { farmId: 'farm-123' };
      const queryResult = [{ plot: mockPlot }];

      queryBus.execute.mockResolvedValue(queryResult);
      plotMapper.fromDomain.mockReturnValue(mockPlotResponse);

      const result = await resolver.getPlotsByFarmId(input);

      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetPlotsByFarmIdQuery('farm-123'),
      );
      expect(plotMapper.fromDomain).toHaveBeenCalledWith(mockPlot);
      expect(result).toEqual([mockPlotResponse]);
    });
  });

  describe('createPlot', () => {
    it('should create a new plot', async () => {
      const input: CreatePlotRequestDto = {
        name: 'New Plot',
        description: 'A new plot',
        width: 15,
        length: 25,
        height: 2,
        unitMeasurement: UNIT_MEASUREMENT.FEET,
        soilType: PLOT_SOIL_TYPES.CLAY,
        soilPh: 7.0,
        status: PLOT_STATUS.ACTIVE,
        farmId: 'farm-123',
      };
      const commandResult = { plot: mockPlot };

      commandBus.execute.mockResolvedValue(commandResult);
      plotMapper.fromDomain.mockReturnValue(mockPlotResponse);

      const result = await resolver.createPlot(input);

      expect(commandBus.execute).toHaveBeenCalledWith(
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
      expect(plotMapper.fromDomain).toHaveBeenCalledWith(mockPlot);
      expect(result).toEqual(mockPlotResponse);
    });
  });

  describe('updatePlot', () => {
    it('should update an existing plot', async () => {
      const input: UpdatePlotRequestDto = {
        id: validUuid,
        name: 'Updated Plot',
        description: 'An updated plot',
        width: 20,
        length: 30,
        height: 3,
        unitMeasurement: UNIT_MEASUREMENT.METERS,
        soilType: PLOT_SOIL_TYPES.LOAM,
        soilPh: 6.8,
        status: PLOT_STATUS.INACTIVE,
      };
      const commandResult = { plot: mockPlot };

      commandBus.execute.mockResolvedValue(commandResult);
      plotMapper.fromDomain.mockReturnValue(mockPlotResponse);

      const result = await resolver.updatePlot(input);

      expect(commandBus.execute).toHaveBeenCalledWith(
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
      expect(plotMapper.fromDomain).toHaveBeenCalledWith(mockPlot);
      expect(result).toEqual(mockPlotResponse);
    });
  });

  describe('deletePlot', () => {
    it('should delete a plot', async () => {
      const input: DeletePlotRequestDto = { id: validUuid };

      commandBus.execute.mockResolvedValue(true);

      const result = await resolver.deletePlot(input);

      expect(commandBus.execute).toHaveBeenCalledWith(
        new DeletePlotCommand(validUuid),
      );
      expect(result).toBe(true);
    });
  });
});
