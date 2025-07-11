import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Auth } from '../../entities/auth.entity';
import { AuthEmailValueObject } from '../../value-objects/auth-email/auth-email.value-object';
import { AuthPasswordValueObject } from '../../value-objects/auth-password/auth-password.value-object';

/**
 * Factory class for creating Auth domain objects from primitive data
 *
 * @author GreenHub Labs
 */
@Injectable()
export class AuthFactory {
  /**
   * Creates a new Auth domain object from primitive data
   * @param data - The primitive data to create the Auth from
   * @returns A new Auth domain object
   */
  create(data: {
    userId: string;
    email: string;
    hashedPassword: string;
    phone?: string;
    isVerified?: boolean;
  }): Auth {
    return new Auth({
      id: randomUUID(),
      userId: data.userId,
      email: new AuthEmailValueObject(data.email),
      password: AuthPasswordValueObject.fromHash(data.hashedPassword),
      phone: data.phone,
      isVerified: data.isVerified ?? false,
      lastLogin: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: undefined,
      emitEvent: true, // Allow events for new entities
    });
  }

  /**
   * Creates a new Auth domain object for user registration
   * @param data - Registration data
   * @returns A new Auth domain object
   */
  createForRegistration(data: {
    userId: string;
    email: string;
    hashedPassword: string;
    phone?: string;
  }): Auth {
    return this.create({
      userId: data.userId,
      email: data.email,
      hashedPassword: data.hashedPassword,
      phone: data.phone,
      isVerified: false, // New registrations start unverified
    });
  }
}
