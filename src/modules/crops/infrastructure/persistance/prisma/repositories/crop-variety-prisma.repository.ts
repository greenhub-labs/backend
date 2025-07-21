import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CropVarietyRepository } from '../../../../application/ports/crop-variety.repository';
import { CropVarietyEntity } from '../../../../domain/entities/crop-variety.entity';
import { CropVarietyPrismaEntity } from '../entities/crop-variety-prisma.entity';

/**
 * Prisma implementation of the CropVarietyRepositoryPort interface
 * Handles persistence operations for CropVarietyEntity using Prisma
 */
@Injectable()
export class CropVarietyPrismaRepository implements CropVarietyRepository {
  private readonly logger = new Logger(CropVarietyPrismaRepository.name);

  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Finds all farms
   * @returns An array of FarmEntity
   */
  async findAll(): Promise<CropVarietyEntity[]> {
    this.logger.debug('Finding all crop varieties');
    const cropVarieties = await this.prisma.cropVariety.findMany({
      where: { deletedAt: null },
    });
    return cropVarieties.map(CropVarietyPrismaEntity.fromPrisma);
  }

  /**
   * Saves a new plot entity to the database
   * @param entity - The plot entity to save
   */
  async save(entity: CropVarietyEntity): Promise<void> {
    this.logger.debug('Saving crop variety', entity);
    const data = CropVarietyPrismaEntity.toPrismaCreate(entity);
    await this.prisma.cropVariety.upsert({
      where: { id: entity.id.value },
      update: data,
      create: data,
    });
  }

  /**
   * Finds a crop variety by its ID
   * @param id - The crop variety ID
   * @returns The crop variety entity or null if not found
   */
  async findById(id: string): Promise<CropVarietyEntity | null> {
    this.logger.debug('Finding crop by id', id);
    const cropVariety = await this.prisma.cropVariety.findUnique({
      where: { id, deletedAt: null },
    });
    if (!cropVariety) return null;
    return CropVarietyPrismaEntity.fromPrisma(cropVariety);
  }

  /**
   * Updates an existing plot entity in the database
   * @param entity - The plot entity to update
   */
  async update(entity: CropVarietyEntity): Promise<void> {
    this.logger.debug('Updating crop variety', entity);
    const data = CropVarietyPrismaEntity.toPrismaUpdate(entity);
    await this.prisma.cropVariety.update({
      where: { id: entity.id.value },
      data,
    });
  }

  /**
   * Deletes a crop variety by its ID (soft delete)
   * @param id - The crop variety ID
   */
  async delete(id: string): Promise<void> {
    this.logger.debug('Deleting crop variety', id);
    await this.prisma.cropVariety.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
