import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CropsRepository } from '../../../../application/ports/crops.repository';
import { CropEntity } from '../../../../domain/entities/crop.entity';
import { CropPrismaEntity } from '../entities/crop-prisma.entity';

/**
 * Prisma implementation of the PlotsRepositoryPort interface
 * Handles persistence operations for PlotEntity using Prisma
 */
@Injectable()
export class CropPrismaRepository implements CropsRepository {
  private readonly logger = new Logger(CropPrismaRepository.name);

  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Finds all farms
   * @returns An array of FarmEntity
   */
  async findAll(): Promise<CropEntity[]> {
    this.logger.debug('Finding all plots');
    const crops = await this.prisma.crop.findMany({
      where: { deletedAt: null },
    });
    return crops.map(CropPrismaEntity.fromPrisma);
  }

  /**
   * Saves a new plot entity to the database
   * @param entity - The plot entity to save
   */
  async save(entity: CropEntity): Promise<void> {
    this.logger.debug('Saving crop', entity);
    const data = CropPrismaEntity.toPrismaCreate(entity);
    await this.prisma.crop.upsert({
      where: { id: entity.id.value },
      update: data,
      create: data,
    });
  }

  /**
   * Finds a crop by its ID
   * @param id - The crop ID
   * @returns The crop entity or null if not found
   */
  async findById(id: string): Promise<CropEntity | null> {
    this.logger.debug('Finding crop by id', id);
    const crop = await this.prisma.crop.findUnique({
      where: { id, deletedAt: null },
    });
    if (!crop) return null;
    return CropPrismaEntity.fromPrisma(crop);
  }

  /**
   * Finds all plots by farm ID
   * @param farmId - The farm ID (as string)
   * @returns The Plot entities or empty array if not found
   */
  async findAllByPlotId(plotId: string): Promise<CropEntity[]> {
    this.logger.debug('Finding all crops by plot id', plotId);
    const crops = await this.prisma.crop.findMany({
      where: { plotId, deletedAt: null },
    });
    return crops.map(CropPrismaEntity.fromPrisma);
  }

  /**
   * Updates an existing plot entity in the database
   * @param entity - The plot entity to update
   */
  async update(entity: CropEntity): Promise<void> {
    this.logger.debug('Updating crop', entity);
    const data = CropPrismaEntity.toPrismaUpdate(entity);
    await this.prisma.crop.update({ where: { id: entity.id.value }, data });
  }

  /**
   * Deletes a plot by its ID (soft delete)
   * @param id - The plot ID
   */
  async delete(id: string): Promise<void> {
    this.logger.debug('Deleting crop', id);
    await this.prisma.crop.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
