import { Injectable, Logger } from '@nestjs/common';
import { FarmsRepository } from '../../../../application/ports/farms.repository';
import { FarmEntity } from '../../../../domain/entities/farm.entity';
import { FarmPrismaEntity } from '../entities/farm-prisma.entity';
import { PrismaClient } from '@prisma/client';
import { FARM_MEMBERSHIP_ROLES } from 'src/shared/domain/constants/farm-membership-roles.constant';

/**
 * Prisma implementation of the FarmsRepositoryPort interface
 * Handles persistence operations for FarmEntity using Prisma
 */
@Injectable()
export class FarmPrismaRepository implements FarmsRepository {
  private readonly logger = new Logger(FarmPrismaRepository.name);

  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Finds all farms
   * @returns An array of FarmEntity
   */
  async findAll(): Promise<FarmEntity[]> {
    this.logger.debug('Finding all farms');
    const farms = await this.prisma.farm.findMany();
    return farms.map(FarmPrismaEntity.fromPrisma);
  }

  /**
   * Saves a new farm entity to the database
   * @param entity - The farm entity to save
   */
  async save(entity: FarmEntity): Promise<void> {
    this.logger.debug('Saving farm', entity);
    const data = FarmPrismaEntity.toPrisma(entity);
    await this.prisma.farm.upsert({
      where: { id: entity.id.value },
      update: data,
      create: data,
    });
  }

  /**
   * Finds a farm by its ID
   * @param id - The farm ID
   * @returns The farm entity or null if not found
   */
  async findById(id: string): Promise<FarmEntity | null> {
    this.logger.debug('Finding farm by id', id);
    const farm = await this.prisma.farm.findUnique({ where: { id } });
    if (!farm) return null;
    return FarmPrismaEntity.fromPrisma(farm);
  }

  /**
   * Updates an existing farm entity in the database
   * @param entity - The farm entity to update
   */
  async update(entity: FarmEntity): Promise<void> {
    this.logger.debug('Updating farm', entity);
    const data = FarmPrismaEntity.toPrisma(entity);
    await this.prisma.farm.update({ where: { id: entity.id.value }, data });
  }

  /**
   * Deletes a farm by its ID (soft delete)
   * @param id - The farm ID
   */
  async delete(id: string): Promise<void> {
    this.logger.debug('Deleting farm', id);
    await this.prisma.farm.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
