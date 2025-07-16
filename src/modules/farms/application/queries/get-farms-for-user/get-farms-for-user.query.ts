import { IQuery } from '@nestjs/cqrs';

export class GetFarmsForUserQuery implements IQuery {
  constructor(public readonly userId: string) {}
}
