/**
 * Command to assign a CropVariety to a Crop
 */
export class AssignCropVarietyCommand {
  /** Crop unique identifier */
  readonly cropId: string;
  /** CropVariety unique identifier */
  readonly cropVarietyId: string;

  constructor(params: { cropId: string; cropVarietyId: string }) {
    this.cropId = params.cropId;
    this.cropVarietyId = params.cropVarietyId;
  }
}
