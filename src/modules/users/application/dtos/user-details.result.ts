import { User } from '../../domain/entities/user.entity';

export class UserFarmMembership {
  constructor(
    public readonly farmId: string,
    public readonly farmName: string,
    public readonly role: string,
  ) {}
}

export class UserDetailsResult {
  constructor(
    public readonly user: User,
    public readonly farms: UserFarmMembership[],
  ) {}
}
