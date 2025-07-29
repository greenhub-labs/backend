import { CROP_PLANTING_METHODS } from '../../constants/crop-planting-methods.constant';
import { InvalidCropPlantingMethodException } from '../../exceptions/invalid-crop-planting-method/invalid-crop-planting-method.exception';
import { CropPlantingMethodValueObject } from './crop-planting-method.value-object';

describe('CropPlantingMethodValueObject', () => {
  describe('constructor', () => {
    it('should create a CropPlantingMethodValueObject with valid planting method', () => {
      const plantingMethod = new CropPlantingMethodValueObject(
        CROP_PLANTING_METHODS.DIRECT_SEED,
      );

      expect(plantingMethod).toBeInstanceOf(CropPlantingMethodValueObject);
      expect(plantingMethod.value).toBe(CROP_PLANTING_METHODS.DIRECT_SEED);
    });

    it('should create a CropPlantingMethodValueObject with all valid planting methods', () => {
      const validPlantingMethods = Object.values(CROP_PLANTING_METHODS);

      validPlantingMethods.forEach((methodValue) => {
        const plantingMethod = new CropPlantingMethodValueObject(methodValue);
        expect(plantingMethod.value).toBe(methodValue);
      });
    });
  });

  describe('validation', () => {
    it('should throw InvalidCropPlantingMethodException for empty string', () => {
      expect(() => {
        new CropPlantingMethodValueObject('');
      }).toThrow(InvalidCropPlantingMethodException);
      expect(() => {
        new CropPlantingMethodValueObject('   ');
      }).toThrow(InvalidCropPlantingMethodException);
    });

    it('should throw InvalidCropPlantingMethodException for null or undefined', () => {
      expect(() => {
        new CropPlantingMethodValueObject(null as any);
      }).toThrow(InvalidCropPlantingMethodException);

      expect(() => {
        new CropPlantingMethodValueObject(undefined as any);
      }).toThrow(InvalidCropPlantingMethodException);
    });

    it('should throw InvalidCropPlantingMethodException for invalid planting method', () => {
      const invalidMethods = [
        'INVALID_METHOD',
        'DIRECT_SEED_INVALID',
        'TRANSPLANT_INVALID',
        'RANDOM_METHOD',
        'TEST_METHOD',
        'HYDROPONIC',
        'AEROPONIC',
      ];

      invalidMethods.forEach((invalidMethod) => {
        expect(() => {
          new CropPlantingMethodValueObject(invalidMethod);
        }).toThrow(InvalidCropPlantingMethodException);
      });
    });

    it('should accept valid planting method values', () => {
      const validMethods = [
        CROP_PLANTING_METHODS.DIRECT_SEED,
        CROP_PLANTING_METHODS.TRANSPLANT,
        CROP_PLANTING_METHODS.CUTTING,
        CROP_PLANTING_METHODS.BULB,
      ];

      validMethods.forEach((methodValue) => {
        expect(() => {
          new CropPlantingMethodValueObject(methodValue);
        }).not.toThrow();
      });
    });
  });

  describe('value getter', () => {
    it('should return the correct planting method value', () => {
      const plantingMethod = new CropPlantingMethodValueObject(
        CROP_PLANTING_METHODS.TRANSPLANT,
      );
      expect(plantingMethod.value).toBe(CROP_PLANTING_METHODS.TRANSPLANT);
    });

    it('should return the exact same value that was passed to constructor', () => {
      const testMethod = CROP_PLANTING_METHODS.CUTTING;
      const plantingMethod = new CropPlantingMethodValueObject(testMethod);
      expect(plantingMethod.value).toBe(testMethod);
    });
  });

  describe('immutability', () => {
    it('should be immutable after creation', () => {
      const plantingMethod = new CropPlantingMethodValueObject(
        CROP_PLANTING_METHODS.BULB,
      );
      const originalValue = plantingMethod.value;

      // The value should remain the same
      expect(plantingMethod.value).toBe(originalValue);
      expect(plantingMethod.value).toBe(CROP_PLANTING_METHODS.BULB);
    });
  });

  describe('specific planting methods', () => {
    it('should handle DIRECT_SEED method correctly', () => {
      const plantingMethod = new CropPlantingMethodValueObject(
        CROP_PLANTING_METHODS.DIRECT_SEED,
      );
      expect(plantingMethod.value).toBe('DIRECT_SEED');
    });

    it('should handle TRANSPLANT method correctly', () => {
      const plantingMethod = new CropPlantingMethodValueObject(
        CROP_PLANTING_METHODS.TRANSPLANT,
      );
      expect(plantingMethod.value).toBe('TRANSPLANT');
    });

    it('should handle CUTTING method correctly', () => {
      const plantingMethod = new CropPlantingMethodValueObject(
        CROP_PLANTING_METHODS.CUTTING,
      );
      expect(plantingMethod.value).toBe('CUTTING');
    });

    it('should handle BULB method correctly', () => {
      const plantingMethod = new CropPlantingMethodValueObject(
        CROP_PLANTING_METHODS.BULB,
      );
      expect(plantingMethod.value).toBe('BULB');
    });
  });
});
