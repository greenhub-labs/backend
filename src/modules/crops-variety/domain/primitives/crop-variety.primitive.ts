/**
 * CropVarietyPrimitive
 * Primitive representation of the CropVariety entity for serialization and persistence
 */
export type CropVarietyPrimitive = {
  id: string;
  name: string;
  scientificName: string;
  type: string;
  description: string;
  averageYield: number;
  daysToMaturity: number;
  plantingDepth: number;
  spacingBetween: number;
  waterRequirements: string;
  sunRequirements: string;
  minIdealTemperature: number;
  maxIdealTemperature: number;
  minIdealPh: number;
  maxIdealPh: number;
  compatibleWith: string[];
  incompatibleWith: string[];
  plantingSeasons: string[];
  harvestSeasons: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};
