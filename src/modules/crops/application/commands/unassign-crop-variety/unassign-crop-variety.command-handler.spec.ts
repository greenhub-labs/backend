import { CropsRepository } from '../../ports/crops.repository';
import { UnassignCropVarietyCommand } from './unassign-crop-variety.command';
import { UnassignCropVarietyCommandHandler } from './unassign-crop-variety.command-handler';

describe('UnassignCropVarietyCommandHandler', () => {
  let handler: UnassignCropVarietyCommandHandler;
  let cropsRepository: jest.Mocked<CropsRepository>;

  beforeEach(() => {
    cropsRepository = { findById: jest.fn(), update: jest.fn() } as any;
    handler = new UnassignCropVarietyCommandHandler(cropsRepository);
  });

  it('should unassign the variety from a crop and save', async () => {
    const crop = {
      update: jest.fn().mockReturnValue({}),
      id: { value: 'cropId' },
    } as any;
    cropsRepository.findById.mockResolvedValue(crop);
    const command = new UnassignCropVarietyCommand('cropId');
    await handler.execute(command);
    expect(crop.update).toHaveBeenCalledWith({ varietyId: undefined });
    expect(cropsRepository.update).toHaveBeenCalled();
  });

  it('should throw if crop does not exist', async () => {
    cropsRepository.findById.mockResolvedValue(null);
    const command = new UnassignCropVarietyCommand('not-found');
    await expect(handler.execute(command)).rejects.toThrow();
  });
});
