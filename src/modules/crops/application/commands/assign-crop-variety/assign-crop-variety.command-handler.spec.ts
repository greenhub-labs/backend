import { CropVarietyRepository } from '../../ports/crop-variety.repository';
import { CropsRepository } from '../../ports/crops.repository';
import { AssignCropVarietyCommand } from './assign-crop-variety.command';
import { AssignCropVarietyCommandHandler } from './assign-crop-variety.command-handler';

describe('AssignCropVarietyCommandHandler', () => {
  let handler: AssignCropVarietyCommandHandler;
  let cropsRepository: jest.Mocked<CropsRepository>;
  let cropVarietyRepository: jest.Mocked<CropVarietyRepository>;

  beforeEach(() => {
    cropsRepository = { findById: jest.fn(), update: jest.fn() } as any;
    cropVarietyRepository = { findById: jest.fn() } as any;
    handler = new AssignCropVarietyCommandHandler(
      cropsRepository,
      cropVarietyRepository,
    );
  });

  it('should assign a variety to a crop and save', async () => {
    const crop = {
      update: jest.fn().mockReturnValue({}),
      id: { value: 'cropId' },
    } as any;
    const cropVariety = { id: { value: 'varietyId' } } as any;
    cropsRepository.findById.mockResolvedValue(crop);
    cropVarietyRepository.findById.mockResolvedValue(cropVariety);
    const command = new AssignCropVarietyCommand({
      cropId: 'cropId',
      cropVarietyId: 'varietyId',
    });
    await handler.execute(command);
    expect(crop.update).toHaveBeenCalledWith({ varietyId: 'varietyId' });
    expect(cropsRepository.update).toHaveBeenCalled();
  });

  it('should throw if crop does not exist', async () => {
    cropsRepository.findById.mockResolvedValue(null);
    const command = new AssignCropVarietyCommand({
      cropId: 'not-found',
      cropVarietyId: 'varietyId',
    });
    await expect(handler.execute(command)).rejects.toThrow();
  });

  it('should throw if crop variety does not exist', async () => {
    const crop = {
      update: jest.fn().mockReturnValue({}),
      id: { value: 'cropId' },
    } as any;
    cropsRepository.findById.mockResolvedValue(crop);
    cropVarietyRepository.findById.mockResolvedValue(null);
    const command = new AssignCropVarietyCommand({
      cropId: 'cropId',
      cropVarietyId: 'not-found',
    });
    await expect(handler.execute(command)).rejects.toThrow();
  });
});
