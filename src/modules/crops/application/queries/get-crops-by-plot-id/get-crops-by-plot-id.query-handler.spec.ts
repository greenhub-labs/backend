import { QueryBus } from '@nestjs/cqrs';
import { GetCropVarietyByIdQuery } from 'src/modules/crops-variety/application/queries/get-crop-variety-by-id/get-crop-variety-by-id.query';
import { CropVarietyEntity } from '../../../domain/entities/crop-variety.entity';
import { CropEntity } from '../../../domain/entities/crop.entity';
import { CropsRepository } from '../../ports/crops.repository';
import { GetCropsByPlotIdQuery } from './get-crops-by-plot-id.query';
import { GetCropsByPlotIdQueryHandler } from './get-crops-by-plot-id.query-handler';

describe('GetCropsByPlotIdQueryHandler', () => {
  let handler: GetCropsByPlotIdQueryHandler;
  let cropsRepository: jest.Mocked<CropsRepository>;
  let queryBus: jest.Mocked<QueryBus>;

  beforeEach(() => {
    cropsRepository = {
      findAllByPlotId: jest.fn(),
    } as any;

    queryBus = {
      execute: jest.fn(),
    } as any;

    handler = new GetCropsByPlotIdQueryHandler(cropsRepository, queryBus);
  });

  it('should return an array of crops for a plot', async () => {
    const crop = {
      id: { value: 'crop-123' },
      varietyId: { value: 'variety-123' },
    } as any as CropEntity;

    const cropVariety = {
      id: { value: 'variety-123' },
      name: { value: 'Test Variety' },
    } as any as CropVarietyEntity;

    cropsRepository.findAllByPlotId.mockResolvedValue([crop]);
    queryBus.execute.mockResolvedValue(cropVariety);

    const result = await handler.execute(new GetCropsByPlotIdQuery('plot-1'));

    expect(result).toHaveLength(1);
    expect(result[0].crop).toEqual(crop);
    expect(result[0].cropVariety).toEqual(cropVariety);
    expect(cropsRepository.findAllByPlotId).toHaveBeenCalledWith('plot-1');
    expect(queryBus.execute).toHaveBeenCalledWith(
      new GetCropVarietyByIdQuery(crop.varietyId),
    );
  });

  it('should return an empty array if no crops exist for the plot', async () => {
    cropsRepository.findAllByPlotId.mockResolvedValue([]);

    const result = await handler.execute(new GetCropsByPlotIdQuery('plot-1'));

    expect(result).toEqual([]);
    expect(cropsRepository.findAllByPlotId).toHaveBeenCalledWith('plot-1');
    expect(queryBus.execute).not.toHaveBeenCalled();
  });
});
