import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetFarmsByIdQuery } from './get-farms-by-id.query';

/**
 * Handler for GetFarmsByIdQuery.
 * Add your business logic in the execute method.
 */
@QueryHandler(GetFarmsByIdQuery)
export class GetFarmsByIdQueryHandler implements IQueryHandler<GetFarmsByIdQuery> {
  /**
   * Executes the get by id query.
   * @param query - The get by id query
   */
  async execute(query: GetFarmsByIdQuery): Promise<any> {
    // Implement your query logic here
    return null;
  }
} 