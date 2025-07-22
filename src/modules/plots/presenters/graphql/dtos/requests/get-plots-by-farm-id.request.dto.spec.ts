import { validate } from 'class-validator';
import { GetPlotsByFarmIdRequestDto } from './get-plots-by-farm-id.request.dto';

describe('GetPlotsByFarmIdRequestDto', () => {
  const validUuid = '123e4567-e89b-12d3-a456-426614174000';

  describe('validation', () => {
    it('should pass validation with valid UUID', async () => {
      const dto = new GetPlotsByFarmIdRequestDto();
      dto.farmId = validUuid;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when farmId is missing', async () => {
      const dto = new GetPlotsByFarmIdRequestDto();

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('farmId');
    });

    it('should fail validation when farmId is not a valid UUID', async () => {
      const dto = new GetPlotsByFarmIdRequestDto();
      dto.farmId = 'invalid-uuid';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('farmId');
    });

    it('should fail validation when farmId is empty string', async () => {
      const dto = new GetPlotsByFarmIdRequestDto();
      dto.farmId = '';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('farmId');
    });
  });
});
