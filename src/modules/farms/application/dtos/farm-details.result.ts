import { PlotDetailsResult } from 'src/modules/plots/application/dtos/plot-details.result';
import { FarmEntity } from '../../domain/entities/farm.entity';
import { FarmMemberWithRole } from '../ports/farm-memberships.repository';

/**
 * Aggregated result for farm details, including members and extensible for future fields.
 */
export class FarmDetailsResult {
  constructor(
    public readonly farm: FarmEntity,
    public readonly members: FarmMemberWithRole[],
    public readonly plots?: PlotDetailsResult[],
    // Future: plots, configuration, sensors, etc.
  ) {}
}
