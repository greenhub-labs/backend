/**
 * Value Object representing the GPS coordinates of a Farm.
 *
 * @property latitude - Latitude of the farm
 * @property longitude - Longitude of the farm
 */
export interface FarmCoordinatesProps {
  latitude?: number;
  longitude?: number;
}

export class FarmCoordinatesValueObject {
  public readonly value: FarmCoordinatesProps;
  /**
   * Creates a new FarmCoordinatesValueObject
   * @param props - The coordinates properties
   */
  constructor(props: FarmCoordinatesProps) {
    this.value = props;
    this.validate();
  }

  /**
   * Returns the latitude of the farm
   */
  get latitude(): number | undefined {
    return this.value.latitude;
  }

  /**
   * Returns the longitude of the farm
   */
  get longitude(): number | undefined {
    return this.value.longitude;
  }

  /**
   * Validates the coordinates properties
   */
  protected validate(): void {
    if (
      this.value.latitude === undefined &&
      this.value.longitude === undefined
    ) {
      return;
    }

    if (
      this.value.latitude !== undefined &&
      (this.value.latitude < -90 || this.value.latitude > 90)
    ) {
      throw new Error('Latitude must be between -90 and 90.');
    }
    if (
      this.value.longitude !== undefined &&
      (this.value.longitude < -180 || this.value.longitude > 180)
    ) {
      throw new Error('Longitude must be between -180 and 180.');
    }
  }
}
