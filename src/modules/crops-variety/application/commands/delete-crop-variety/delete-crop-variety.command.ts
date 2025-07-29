/**
 * Command to delete a CropVariety by its ID
 */
export class DeleteCropVarietyCommand {
  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}
