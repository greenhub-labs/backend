import { CropEntity } from '../../../domain/entities/crop.entity';
import { CropsRepository } from '../../ports/crops.repository';
import { GetCropsByPlotIdQuery } from './get-crops-by-plot-id.query';
import { GetCropsByPlotIdQueryHandler } from './get-crops-by-plot-id.query-handler';

describe('GetCropsByPlotIdQueryHandler', () => {
  let handler: GetCropsByPlotIdQueryHandler;
  let cropsRepository: jest.Mocked<CropsRepository>;
  beforeEach(() => {
    cropsRepository = {
      findAllByPlotId: jest.fn(),
    } as any;
    handler = new GetCropsByPlotIdQueryHandler(cropsRepository);
  });

  it('should return an array of crops for a plot', async () => {
    const crop = { id: { value: 'crop-123' } } as any as CropEntity;
    cropsRepository.findAllByPlotId.mockResolvedValue([crop]);
    const result = await handler.execute(new GetCropsByPlotIdQuery('plot-1'));
    expect(result).toEqual([{ crop }]);
    expect(cropsRepository.findAllByPlotId).toHaveBeenCalledWith('plot-1');
  });

  it('should return an empty array if no crops exist for the plot', async () => {
    cropsRepository.findAllByPlotId.mockResolvedValue([]);
    const result = await handler.execute(new GetCropsByPlotIdQuery('plot-1'));
    expect(result).toEqual([]);
    expect(cropsRepository.findAllByPlotId).toHaveBeenCalledWith('plot-1');
  });
});
