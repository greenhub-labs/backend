import { Auth } from '../../../../domain/entities/auth.entity';
import { AuthEmailValueObject } from '../../../../domain/value-objects/auth-email/auth-email.value-object';
import { AuthPasswordValueObject } from '../../../../domain/value-objects/auth-password/auth-password.value-object';

/**
 * AuthPrismaEntity
 * Maps between Prisma auth model and domain Auth entity
 *
 * @author GreenHub Labs
 */
export class AuthPrismaEntity {
  /**
   * Converts a Prisma auth record to a domain Auth entity
   * @param prismaAuth - The Prisma auth record
   */
  static fromPrisma(prismaAuth: any): Auth {
    return new Auth({
      id: prismaAuth.id,
      userId: prismaAuth.userId,
      email: new AuthEmailValueObject(prismaAuth.email),
      password: AuthPasswordValueObject.fromHash(prismaAuth.password),
      phone: prismaAuth.phone,
      isVerified: prismaAuth.isVerified,
      lastLogin: prismaAuth.lastLogin
        ? new Date(prismaAuth.lastLogin)
        : undefined,
      createdAt: new Date(prismaAuth.createdAt),
      updatedAt: new Date(prismaAuth.updatedAt),
      deletedAt: prismaAuth.deletedAt
        ? new Date(prismaAuth.deletedAt)
        : undefined,
      emitEvent: false, // Don't emit events when recreating from persistence
    });
  }

  /**
   * Converts a domain Auth entity to a Prisma auth record
   * @param auth - The domain Auth entity
   */
  static toPrisma(auth: Auth): any {
    return {
      id: auth.id,
      userId: auth.userId,
      email: auth.email.value,
      password: auth.password.value,
      phone: auth.phone || null,
      isVerified: auth.isVerified,
      lastLogin: auth.lastLogin || null,
      createdAt: auth.createdAt,
      updatedAt: auth.updatedAt,
      deletedAt: auth.deletedAt || null,
    };
  }
}
