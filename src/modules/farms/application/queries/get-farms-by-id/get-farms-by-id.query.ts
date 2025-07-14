/**
 * Query to get a farms by id.
 * Add more properties as needed for your use case.
 */
export class GetFarmsByIdQuery {
  /** The id of the farms to retrieve */
  public readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
} 