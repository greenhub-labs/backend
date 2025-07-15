import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { FarmMembershipsRepository } from 'src/modules/farms/application/ports/farm-memberships.repository';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { UserPrismaEntity } from 'src/modules/users/infrastructure/persistance/prisma/entities/user-prisma.entity';
import { FARM_MEMBERSHIP_ROLES } from 'src/shared/domain/constants/farm-membership-roles.constant';
import { FarmEntity } from 'src/modules/farms/domain/entities/farm.entity';
import { FarmPrismaEntity } from 'src/modules/farms/infrastructure/persistance/prisma/entities/farm-prisma.entity';

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
  private readonly logger = new Logger(FarmMembershipsPrismaRepository.name);

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

  /**
   * Assigns a user to a farm (creates a FarmMembership)
   * @param farmId - The Farm ID (as string)
   * @param userId - The User ID (as string)
   */
  async assignUserToFarm(
    farmId: string,
    userId: string,
    role: FARM_MEMBERSHIP_ROLES,
  ): Promise<void> {
    this.logger.debug('Assigning user to farm', farmId, userId);
    // Buscar el id del rol OWNER por defecto
    const roleEntity = await this.prisma.role.findUnique({
      where: { name: role },
    });
    if (!roleEntity) throw new Error('Default role not found');
    try {
      await this.prisma.farmMembership.create({
        data: {
          farmId,
          userId,
          roleId: roleEntity.id,
          isActive: true,
        },
      });
    } catch (err) {
      // Si ya existe la relación, ignora el error de duplicado
      if (err.code !== 'P2002') throw err;
    }
  }

  async getFarmsByUserId(
    userId: string,
  ): Promise<{ farm: FarmEntity; role: FARM_MEMBERSHIP_ROLES }[]> {
    this.logger.debug('Getting farms by user id', userId);
    const memberships = await this.prisma.farmMembership.findMany({
      where: { userId, isActive: true, deletedAt: null },
      include: { farm: true, role: true },
    });
    return memberships.map((membership) => ({
      farm: FarmPrismaEntity.fromPrisma(membership.farm),
      role: membership.role.name as FARM_MEMBERSHIP_ROLES,
    }));
  }
}
