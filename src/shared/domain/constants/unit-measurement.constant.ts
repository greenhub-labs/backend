export enum UNIT_MEASUREMENT {
  // Metric units
  METERS = 'METERS',
  CENTIMETERS = 'CENTIMETERS',
  KILOMETERS = 'KILOMETERS',
  MILLIMETERS = 'MILLIMETERS',

  // Imperial units
  FEET = 'FEET',
  INCHES = 'INCHES',
  YARDS = 'YARDS',
  MILES = 'MILES',
}

/**
 * Unit measurement categories for grouping
 */
export enum UNIT_MEASUREMENT_CATEGORY {
  METRIC = 'METRIC',
  IMPERIAL = 'IMPERIAL',
}

/**
 * Helper function to get the category of a unit measurement
 */
export function getUnitMeasurementCategory(
  unit: UNIT_MEASUREMENT,
): UNIT_MEASUREMENT_CATEGORY {
  const metricUnits = [
    UNIT_MEASUREMENT.METERS,
    UNIT_MEASUREMENT.CENTIMETERS,
    UNIT_MEASUREMENT.KILOMETERS,
    UNIT_MEASUREMENT.MILLIMETERS,
  ];

  return metricUnits.includes(unit)
    ? UNIT_MEASUREMENT_CATEGORY.METRIC
    : UNIT_MEASUREMENT_CATEGORY.IMPERIAL;
}

/**
 * Conversion factors to meters (base unit)
 */
export const UNIT_TO_METERS: Record<UNIT_MEASUREMENT, number> = {
  [UNIT_MEASUREMENT.METERS]: 1,
  [UNIT_MEASUREMENT.CENTIMETERS]: 0.01,
  [UNIT_MEASUREMENT.KILOMETERS]: 1000,
  [UNIT_MEASUREMENT.MILLIMETERS]: 0.001,
  [UNIT_MEASUREMENT.FEET]: 0.3048,
  [UNIT_MEASUREMENT.INCHES]: 0.0254,
  [UNIT_MEASUREMENT.YARDS]: 0.9144,
  [UNIT_MEASUREMENT.MILES]: 1609.344,
};

/**
 * Helper function to convert between units
 */
export function convertUnit(
  value: number,
  fromUnit: UNIT_MEASUREMENT,
  toUnit: UNIT_MEASUREMENT,
): number {
  // Convert to meters first
  const meters = value * UNIT_TO_METERS[fromUnit];
  // Convert from meters to target unit
  return meters / UNIT_TO_METERS[toUnit];
}
