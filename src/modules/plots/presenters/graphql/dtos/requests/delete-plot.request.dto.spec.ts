import { validate } from 'class-validator';
import { DeletePlotRequestDto } from './delete-plot.request.dto';

describe('DeletePlotRequestDto', () => {
  const validUuid = '123e4567-e89b-12d3-a456-426614174000';

  describe('validation', () => {
    it('should pass validation with valid UUID', async () => {
      const dto = new DeletePlotRequestDto();
      dto.id = validUuid;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when id is missing', async () => {
      const dto = new DeletePlotRequestDto();

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('id');
    });

    it('should fail validation when id is not a valid UUID', async () => {
      const dto = new DeletePlotRequestDto();
      dto.id = 'invalid-uuid';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('id');
    });

    it('should fail validation when id is empty string', async () => {
      const dto = new DeletePlotRequestDto();
      dto.id = '';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('id');
    });
  });
});
