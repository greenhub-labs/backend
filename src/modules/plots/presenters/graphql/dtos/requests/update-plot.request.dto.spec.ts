import { validate } from 'class-validator';
import { PLOT_SOIL_TYPES } from 'src/modules/plots/domain/constants/plot-soil-types.constant';
import { PLOT_STATUS } from 'src/modules/plots/domain/constants/plot-status.constant';
import { UNIT_MEASUREMENT } from 'src/shared/domain/constants/unit-measurement.constant';
import { UpdatePlotRequestDto } from './update-plot.request.dto';

describe('UpdatePlotRequestDto', () => {
  const validUuid = '123e4567-e89b-12d3-a456-426614174000';

  describe('validation', () => {
    it('should pass validation with valid data', async () => {
      const dto = new UpdatePlotRequestDto();
      dto.id = validUuid;
      dto.name = 'Updated Plot';
      dto.description = 'An updated plot';
      dto.width = 15;
      dto.length = 25;
      dto.height = 2;
      dto.unitMeasurement = UNIT_MEASUREMENT.FEET;
      dto.soilType = PLOT_SOIL_TYPES.CLAY;
      dto.soilPh = 7.5;
      dto.status = PLOT_STATUS.INACTIVE;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with only required id', async () => {
      const dto = new UpdatePlotRequestDto();
      dto.id = validUuid;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when id is missing', async () => {
      const dto = new UpdatePlotRequestDto();
      dto.name = 'Updated Plot';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('id');
    });

    it('should fail validation when id is not a valid UUID', async () => {
      const dto = new UpdatePlotRequestDto();
      dto.id = 'invalid-uuid';

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('id');
    });

    it('should fail validation when width is negative', async () => {
      const dto = new UpdatePlotRequestDto();
      dto.id = validUuid;
      dto.width = -1;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('width');
    });

    it('should fail validation when length is negative', async () => {
      const dto = new UpdatePlotRequestDto();
      dto.id = validUuid;
      dto.length = -1;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('length');
    });

    it('should fail validation when height is negative', async () => {
      const dto = new UpdatePlotRequestDto();
      dto.id = validUuid;
      dto.height = -1;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('height');
    });

    it('should fail validation when soilPh is below 0', async () => {
      const dto = new UpdatePlotRequestDto();
      dto.id = validUuid;
      dto.soilPh = -1;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('soilPh');
    });

    it('should fail validation when soilPh is above 14', async () => {
      const dto = new UpdatePlotRequestDto();
      dto.id = validUuid;
      dto.soilPh = 15;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('soilPh');
    });

    it('should fail validation when unitMeasurement is invalid', async () => {
      const dto = new UpdatePlotRequestDto();
      dto.id = validUuid;
      dto.unitMeasurement = 'INVALID' as UNIT_MEASUREMENT;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('unitMeasurement');
    });

    it('should fail validation when soilType is invalid', async () => {
      const dto = new UpdatePlotRequestDto();
      dto.id = validUuid;
      dto.soilType = 'INVALID' as PLOT_SOIL_TYPES;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('soilType');
    });

    it('should fail validation when status is invalid', async () => {
      const dto = new UpdatePlotRequestDto();
      dto.id = validUuid;
      dto.status = 'INVALID' as PLOT_STATUS;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('status');
    });

    it('should pass validation with partial updates', async () => {
      const dto = new UpdatePlotRequestDto();
      dto.id = validUuid;
      dto.name = 'Only Name Updated';

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });
});
