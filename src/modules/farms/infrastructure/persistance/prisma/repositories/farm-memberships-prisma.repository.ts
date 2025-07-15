import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { FarmMembershipsRepository } from 'src/modules/farms/application/ports/farm-memberships.repository';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { UserPrismaEntity } from 'src/modules/users/infrastructure/persistance/prisma/entities/user-prisma.entity';
import { FARM_MEMBERSHIP_ROLES } from 'src/modules/farms/domain/constants/farm-membership-roles.constant';

export const FARM_MEMBERSHIPS_REPOSITORY_TOKEN =
  'FARM_MEMBERSHIPS_REPOSITORY_TOKEN';

/**
 * Prisma implementation of the FarmMembershipsRepository interface
 * Retrieves users assigned to a farm using Prisma
 */
@Injectable()
export class FarmMembershipsPrismaRepository
  implements FarmMembershipsRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async getUsersByFarmId(
    farmId: string,
  ): Promise<{ user: User; role: FARM_MEMBERSHIP_ROLES }[]> {
    const memberships = await this.prisma.farmMembership.findMany({
      where: { farmId, isActive: true, deletedAt: null },
      include: { user: true, role: true },
    });
    return memberships.map((m) => ({
      user: UserPrismaEntity.fromPrisma(m.user),
      role: m.role.name as FARM_MEMBERSHIP_ROLES,
    }));
  }
}
