import { CropVarietyEntity } from '../../../domain/entities/crop-variety.entity';
import { CropVarietyRepository } from '../../ports/crop-variety.repository';
import { DeleteCropVarietyCommand } from './delete-crop-variety.command';
import { DeleteCropVarietyCommandHandler } from './delete-crop-variety.command-handler';

describe('DeleteCropVarietyCommandHandler', () => {
  let handler: DeleteCropVarietyCommandHandler;
  let cropVarietyRepository: jest.Mocked<CropVarietyRepository>;

  beforeEach(() => {
    cropVarietyRepository = { findById: jest.fn(), update: jest.fn() } as any;
    handler = new DeleteCropVarietyCommandHandler(cropVarietyRepository);
  });

  it('should soft delete a crop variety', async () => {
    const cropVariety = {
      delete: jest.fn().mockReturnValue({}),
      id: { value: 'id' },
    } as any as CropVarietyEntity;
    cropVarietyRepository.findById.mockResolvedValue(cropVariety);
    const command = new DeleteCropVarietyCommand('id');
    await handler.execute(command);
    expect(cropVariety.delete).toHaveBeenCalled();
    expect(cropVarietyRepository.update).toHaveBeenCalled();
  });

  it('should throw if crop variety does not exist', async () => {
    cropVarietyRepository.findById.mockResolvedValue(null);
    const command = new DeleteCropVarietyCommand('not-found');
    await expect(handler.execute(command)).rejects.toThrow();
  });
});
