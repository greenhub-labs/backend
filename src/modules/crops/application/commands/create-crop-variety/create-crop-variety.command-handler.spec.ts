import { CropVarietyRepository } from '../../ports/crop-variety.repository';
import { CreateCropVarietyCommand } from './create-crop-variety.command';
import { CreateCropVarietyCommandHandler } from './create-crop-variety.command-handler';

describe('CreateCropVarietyCommandHandler', () => {
  let handler: CreateCropVarietyCommandHandler;
  let cropVarietyRepository: jest.Mocked<CropVarietyRepository>;

  beforeEach(() => {
    cropVarietyRepository = { save: jest.fn() } as any;
    handler = new CreateCropVarietyCommandHandler(cropVarietyRepository);
  });

  it('should create and save a crop variety', async () => {
    const command = new CreateCropVarietyCommand({
      name: 'Tomato',
      type: 'VEGETABLE',
      compatibleWith: [],
      incompatibleWith: [],
      plantingSeasons: [],
      harvestSeasons: [],
    });
    await handler.execute(command);
    expect(cropVarietyRepository.save).toHaveBeenCalled();
  });
});
