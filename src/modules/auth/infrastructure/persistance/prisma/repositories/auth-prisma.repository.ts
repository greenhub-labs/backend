import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AuthRepository } from '../../../../application/ports/auth.repository';
import { Auth } from '../../../../domain/entities/auth.entity';
import { AuthPrismaEntity } from '../entities/auth-prisma.entity';

/**
 * Prisma implementation of the AuthRepository interface
 * Handles persistence operations for Auth entities using Prisma ORM
 *
 * @author GreenHub Labs
 */
@Injectable()
export class AuthPrismaRepository implements AuthRepository {
  /**
   * Creates a new AuthPrismaRepository instance
   * @param prisma - The Prisma client instance for database operations
   */
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Finds auth record by user ID
   * @param userId - User ID
   * @returns Auth or null if not found
   */
  async findByUserId(userId: string): Promise<Auth | null> {
    const prismaAuth = await this.prisma.auth.findUnique({
      where: { userId },
    });

    if (!prismaAuth) {
      return null;
    }

    return AuthPrismaEntity.fromPrisma(prismaAuth);
  }

  /**
   * Finds auth record by email
   * @param email - Email address
   * @returns Auth or null if not found
   */
  async findByEmail(email: string): Promise<Auth | null> {
    const prismaAuth = await this.prisma.auth.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!prismaAuth) {
      return null;
    }

    return AuthPrismaEntity.fromPrisma(prismaAuth);
  }

  /**
   * Saves an auth record (create or update)
   * @param auth - Auth entity to save
   * @returns Auth ID
   */
  async save(auth: Auth): Promise<string> {
    const authData = AuthPrismaEntity.toPrisma(auth);

    const savedAuth = await this.prisma.auth.upsert({
      where: { id: auth.id },
      update: authData,
      create: authData,
    });

    return savedAuth.id;
  }

  /**
   * Updates an existing auth record
   * @param auth - Auth entity to update
   */
  async update(auth: Auth): Promise<void> {
    const authData = AuthPrismaEntity.toPrisma(auth);

    await this.prisma.auth.update({
      where: { id: auth.id },
      data: authData,
    });
  }

  /**
   * Soft deletes an auth record by user ID
   * @param userId - User ID
   */
  async softDelete(userId: string): Promise<void> {
    await this.prisma.auth.update({
      where: { userId },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Checks if email already exists
   * @param email - Email to check
   * @returns True if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const count = await this.prisma.auth.count({
      where: {
        email: email.toLowerCase(),
        deletedAt: null, // Only check non-deleted records
      },
    });

    return count > 0;
  }
}
