import { CropVarietyEntity } from '../../../domain/entities/crop-variety.entity';
import { CropVarietyRepository } from '../../ports/crop-variety.repository';
import { UpdateCropVarietyCommand } from './update-crop-variety.command';
import { UpdateCropVarietyCommandHandler } from './update-crop-variety.command-handler';

describe('UpdateCropVarietyCommandHandler', () => {
  let handler: UpdateCropVarietyCommandHandler;
  let cropVarietyRepository: jest.Mocked<CropVarietyRepository>;

  beforeEach(() => {
    cropVarietyRepository = { findById: jest.fn(), update: jest.fn() } as any;
    handler = new UpdateCropVarietyCommandHandler(cropVarietyRepository);
  });

  it('should update and save a crop variety', async () => {
    const cropVariety = {
      update: jest.fn().mockReturnValue({}),
      id: { value: 'id' },
    } as any as CropVarietyEntity;
    cropVarietyRepository.findById.mockResolvedValue(cropVariety);
    const command = new UpdateCropVarietyCommand({ id: 'id', name: 'Updated' });
    await handler.execute(command);
    expect(cropVariety.update).toHaveBeenCalledWith({ name: 'Updated' });
    expect(cropVarietyRepository.update).toHaveBeenCalled();
  });

  it('should throw if crop variety does not exist', async () => {
    cropVarietyRepository.findById.mockResolvedValue(null);
    const command = new UpdateCropVarietyCommand({
      id: 'not-found',
      name: 'Updated',
    });
    await expect(handler.execute(command)).rejects.toThrow();
  });
});
