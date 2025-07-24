/**
 * Command to update an existing CropVariety
 */
export class UpdateCropVarietyCommand {
  readonly id: string;
  readonly name?: string;
  readonly scientificName?: string;
  readonly type?: string;
  readonly description?: string;
  readonly averageYield?: number;
  readonly daysToMaturity?: number;
  readonly plantingDepth?: number;
  readonly spacingBetween?: number;
  readonly waterRequirements?: string;
  readonly sunRequirements?: string;
  readonly minIdealTemperature?: number;
  readonly maxIdealTemperature?: number;
  readonly minIdealPh?: number;
  readonly maxIdealPh?: number;
  readonly compatibleWith?: string[];
  readonly incompatibleWith?: string[];
  readonly plantingSeasons?: string[];
  readonly harvestSeasons?: string[];

  constructor(params: {
    id: string;
    name?: string;
    scientificName?: string;
    type?: string;
    description?: string;
    averageYield?: number;
    daysToMaturity?: number;
    plantingDepth?: number;
    spacingBetween?: number;
    waterRequirements?: string;
    sunRequirements?: string;
    minIdealTemperature?: number;
    maxIdealTemperature?: number;
    minIdealPh?: number;
    maxIdealPh?: number;
    compatibleWith?: string[];
    incompatibleWith?: string[];
    plantingSeasons?: string[];
    harvestSeasons?: string[];
  }) {
    this.id = params.id;
    this.name = params.name;
    this.scientificName = params.scientificName;
    this.type = params.type;
    this.description = params.description;
    this.averageYield = params.averageYield;
    this.daysToMaturity = params.daysToMaturity;
    this.plantingDepth = params.plantingDepth;
    this.spacingBetween = params.spacingBetween;
    this.waterRequirements = params.waterRequirements;
    this.sunRequirements = params.sunRequirements;
    this.minIdealTemperature = params.minIdealTemperature;
    this.maxIdealTemperature = params.maxIdealTemperature;
    this.minIdealPh = params.minIdealPh;
    this.maxIdealPh = params.maxIdealPh;
    this.compatibleWith = params.compatibleWith;
    this.incompatibleWith = params.incompatibleWith;
    this.plantingSeasons = params.plantingSeasons;
    this.harvestSeasons = params.harvestSeasons;
  }
}
