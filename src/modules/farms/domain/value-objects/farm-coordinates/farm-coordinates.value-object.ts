import { BaseValueObject } from 'src/shared/domain/value-objects/base.value-object';

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

export class FarmCoordinatesValueObject extends BaseValueObject<FarmCoordinatesProps> {
  /**
   * Creates a new FarmCoordinatesValueObject
   * @param props - The coordinates properties
   */
  constructor(props: FarmCoordinatesProps) {
    super(props);
    this.validate();
  }

  private getProps(): FarmCoordinatesProps {
    return (this as any).props ?? {};
  }

  /**
   * Returns the latitude of the farm
   */
  get latitude(): number | undefined {
    return this.getProps().latitude;
  }

  /**
   * Returns the longitude of the farm
   */
  get longitude(): number | undefined {
    return this.getProps().longitude;
  }

  /**
   * Validates the coordinates properties
   */
  protected validate(): void {
    const props = this.getProps();
    if (props.latitude === undefined && props.longitude === undefined) {
      throw new Error(
        'At least one coordinate (latitude or longitude) must be provided.',
      );
    }
    if (
      props.latitude !== undefined &&
      (props.latitude < -90 || props.latitude > 90)
    ) {
      throw new Error('Latitude must be between -90 and 90.');
    }
    if (
      props.longitude !== undefined &&
      (props.longitude < -180 || props.longitude > 180)
    ) {
      throw new Error('Longitude must be between -180 and 180.');
    }
  }
}
