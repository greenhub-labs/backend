import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PlotsRepository } from '../../../../application/ports/plots.repository';
import { PlotEntity } from '../../../../domain/entities/plot.entity';
import { PlotPrismaEntity } from '../entities/plot-prisma.entity';

/**
 * Prisma implementation of the PlotsRepositoryPort interface
 * Handles persistence operations for PlotEntity using Prisma
 */
@Injectable()
export class PlotPrismaRepository implements PlotsRepository {
  private readonly logger = new Logger(PlotPrismaRepository.name);

  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Finds all farms
   * @returns An array of FarmEntity
   */
  async findAll(): Promise<PlotEntity[]> {
    this.logger.debug('Finding all plots');
    const plots = await this.prisma.plot.findMany({
      where: { deletedAt: null },
    });
    return plots.map(PlotPrismaEntity.fromPrisma);
  }

  /**
   * Saves a new plot entity to the database
   * @param entity - The plot entity to save
   */
  async save(entity: PlotEntity): Promise<void> {
    this.logger.debug('Saving plot', entity);
    const data = PlotPrismaEntity.toPrismaCreate(entity);
    await this.prisma.plot.upsert({
      where: { id: entity.id.value },
      update: data,
      create: data,
    });
  }

  /**
   * Finds a plot by its ID
   * @param id - The plot ID
   * @returns The plot entity or null if not found
   */
  async findById(id: string): Promise<PlotEntity | null> {
    this.logger.debug('Finding plot by id', id);
    const plot = await this.prisma.plot.findUnique({
      where: { id, deletedAt: null },
    });
    if (!plot) return null;
    return PlotPrismaEntity.fromPrisma(plot);
  }

  /**
   * Finds all plots by farm ID
   * @param farmId - The farm ID (as string)
   * @returns The Plot entities or empty array if not found
   */
  async findAllByFarmId(farmId: string): Promise<PlotEntity[]> {
    this.logger.debug('Finding all plots by farm id', farmId);
    const plots = await this.prisma.plot.findMany({
      where: { farmId, deletedAt: null },
    });
    return plots.map(PlotPrismaEntity.fromPrisma);
  }

  /**
   * Updates an existing plot entity in the database
   * @param entity - The plot entity to update
   */
  async update(entity: PlotEntity): Promise<void> {
    this.logger.debug('Updating plot', entity);
    const data = PlotPrismaEntity.toPrismaUpdate(entity);
    await this.prisma.plot.update({ where: { id: entity.id.value }, data });
  }

  /**
   * Deletes a plot by its ID (soft delete)
   * @param id - The plot ID
   */
  async delete(id: string): Promise<void> {
    this.logger.debug('Deleting plot', id);
    await this.prisma.plot.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
