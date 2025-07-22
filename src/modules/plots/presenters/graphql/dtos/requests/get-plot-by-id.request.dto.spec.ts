import { validate } from 'class-validator';
import { GetPlotByIdRequestDto } from './get-plot-by-id.request.dto';

describe('GetPlotByIdRequestDto', () => {
  const validUuid = '123e4567-e89b-12d3-a456-426614174000';

  describe('validation', () => {
    it('should pass validation with valid UUID', async () => {
      const dto = new GetPlotByIdRequestDto();
      dto.id = validUuid;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when id is missing', async () => {
      const dto = new GetPlotByIdRequestDto();

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('id');
    });

    it('should fail validation when id is not a valid UUID', async () => {
      const dto = new GetPlotByIdRequestDto();
      dto.id = 'invalid-uuid';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('id');
    });

    it('should fail validation when id is empty string', async () => {
      const dto = new GetPlotByIdRequestDto();
      dto.id = '';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('id');
    });
  });
});
