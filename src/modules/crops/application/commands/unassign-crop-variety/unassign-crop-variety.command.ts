/**
 * Command to unassign the CropVariety from a Crop
 */
export class UnassignCropVarietyCommand {
  /** Crop unique identifier */
  readonly cropId: string;

  constructor(cropId: string) {
    this.cropId = cropId;
  }
}
