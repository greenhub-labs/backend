import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllFarmsQuery } from './get-all-farms.query';
import {
  FARMS_REPOSITORY_TOKEN,
  FarmsRepository,
} from '../../ports/farms.repository';
import { FarmEntity } from '../../../domain/entities/farm.entity';
import {
  FARMS_CACHE_REPOSITORY_TOKEN,
  FarmsCacheRepository,
} from '../../ports/farms-cache.repository';

/**
 * Query handler for GetAllFarmsQuery
 */
@QueryHandler(GetAllFarmsQuery)
export class GetAllFarmsQueryHandler
  implements IQueryHandler<GetAllFarmsQuery>
{
  constructor(
    @Inject(FARMS_REPOSITORY_TOKEN)
    private readonly farmsRepository: FarmsRepository,
    @Inject(FARMS_CACHE_REPOSITORY_TOKEN)
    private readonly farmsCacheRepository: FarmsCacheRepository,
  ) {}

  /**
   * Handles the GetAllFarmsQuery
   * @param query - The query to handle
   * @returns Array of FarmEntity
   */
  async execute(query: GetAllFarmsQuery): Promise<FarmEntity[]> {
    return this.farmsRepository.findAll();
  }
}
