import { validate } from 'class-validator';
import { PLOT_SOIL_TYPES } from 'src/modules/plots/domain/constants/plot-soil-types.constant';
import { PLOT_STATUS } from 'src/modules/plots/domain/constants/plot-status.constant';
import { UNIT_MEASUREMENT } from 'src/shared/domain/constants/unit-measurement.constant';
import { CreatePlotRequestDto } from './create-plot.request.dto';

describe('CreatePlotRequestDto', () => {
  const validUuid = '123e4567-e89b-12d3-a456-426614174000';

  describe('validation', () => {
    it('should pass validation with valid data', async () => {
      const dto = new CreatePlotRequestDto();
      dto.name = 'Test Plot';
      dto.farmId = validUuid;
      dto.description = 'A test plot';
      dto.width = 10;
      dto.length = 20;
      dto.height = 1;
      dto.unitMeasurement = UNIT_MEASUREMENT.METERS;
      dto.soilType = PLOT_SOIL_TYPES.SANDY;
      dto.soilPh = 6.5;
      dto.status = PLOT_STATUS.ACTIVE;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with minimal required data', async () => {
      const dto = new CreatePlotRequestDto();
      dto.name = 'Test Plot';
      dto.farmId = validUuid;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when name is missing', async () => {
      const dto = new CreatePlotRequestDto();
      dto.farmId = validUuid;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
    });

    it('should fail validation when farmId is missing', async () => {
      const dto = new CreatePlotRequestDto();
      dto.name = 'Test Plot';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('farmId');
    });

    it('should fail validation when farmId is not a valid UUID', async () => {
      const dto = new CreatePlotRequestDto();
      dto.name = 'Test Plot';
      dto.farmId = 'invalid-uuid';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('farmId');
    });

    it('should fail validation when width is negative', async () => {
      const dto = new CreatePlotRequestDto();
      dto.name = 'Test Plot';
      dto.farmId = validUuid;
      dto.width = -1;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('width');
    });

    it('should fail validation when length is negative', async () => {
      const dto = new CreatePlotRequestDto();
      dto.name = 'Test Plot';
      dto.farmId = validUuid;
      dto.length = -1;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('length');
    });

    it('should fail validation when height is negative', async () => {
      const dto = new CreatePlotRequestDto();
      dto.name = 'Test Plot';
      dto.farmId = validUuid;
      dto.height = -1;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('height');
    });

    it('should fail validation when soilPh is below 0', async () => {
      const dto = new CreatePlotRequestDto();
      dto.name = 'Test Plot';
      dto.farmId = validUuid;
      dto.soilPh = -1;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('soilPh');
    });

    it('should fail validation when soilPh is above 14', async () => {
      const dto = new CreatePlotRequestDto();
      dto.name = 'Test Plot';
      dto.farmId = validUuid;
      dto.soilPh = 15;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('soilPh');
    });

    it('should fail validation when unitMeasurement is invalid', async () => {
      const dto = new CreatePlotRequestDto();
      dto.name = 'Test Plot';
      dto.farmId = validUuid;
      dto.unitMeasurement = 'INVALID' as UNIT_MEASUREMENT;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('unitMeasurement');
    });

    it('should fail validation when soilType is invalid', async () => {
      const dto = new CreatePlotRequestDto();
      dto.name = 'Test Plot';
      dto.farmId = validUuid;
      dto.soilType = 'INVALID' as PLOT_SOIL_TYPES;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('soilType');
    });

    it('should fail validation when status is invalid', async () => {
      const dto = new CreatePlotRequestDto();
      dto.name = 'Test Plot';
      dto.farmId = validUuid;
      dto.status = 'INVALID' as PLOT_STATUS;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('status');
    });
  });
});
