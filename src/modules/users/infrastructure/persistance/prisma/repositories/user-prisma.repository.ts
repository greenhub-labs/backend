import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../../../../application/ports/user.repository';
import { User } from '../../../../domain/entities/user.entity';
import { PrismaClient } from '@prisma/client';
import { UserPrismaEntity } from '../entities/user-prisma.entity';

/**
 * Prisma implementation of the UserRepository interface
 * Handles persistence operations for User entities using Prisma ORM
 */
@Injectable()
export class UserPrismaRepository implements UserRepository {
  private readonly logger = new Logger(UserPrismaRepository.name);
  /**
   * Creates a new UserPrismaRepository instance
   * @param prisma - The Prisma client instance for database operations
   */
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Finds a user by their unique identifier
   * @param id - The unique identifier of the user to find
   * @returns Promise resolving to the User entity if found, null otherwise
   */
  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return UserPrismaEntity.fromPrisma(user);
  }

  /**
   * Saves a new user or updates an existing one
   * @param user - The User entity to save
   * @returns Promise resolving to the ID of the saved user
   */
  async save(user: User): Promise<string> {
    this.logger.debug(`Saving user ${JSON.stringify(user)}`);
    const data = UserPrismaEntity.toPrisma(user);
    const saved = await this.prisma.user.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
    return saved.id;
  }

  /**
   * Updates an existing user's information
   * @param user - The User entity containing updated information
   * @returns Promise resolving when the update is complete
   */
  async update(user: User): Promise<void> {
    const data = UserPrismaEntity.toPrisma(user);
    await this.prisma.user.update({ where: { id: data.id }, data });
  }

  /**
   * Soft deletes a user by setting their deletion timestamp
   * @param id - The unique identifier of the user to soft delete
   * @returns Promise resolving when the soft delete is complete
   */
  async softDelete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
