import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HashingService } from '../../application/ports/hashing.service';

/**
 * Bcrypt implementation of the HashingService interface
 * Provides password hashing and comparison using bcrypt algorithm
 *
 * @author GreenHub Labs
 */
@Injectable()
export class BcryptHashingService implements HashingService {
  private readonly defaultSaltRounds = 12;

  /**
   * Hashes a plain text password using bcrypt
   * @param plainPassword - Plain text password to hash
   * @param saltRounds - Number of salt rounds (default: 12)
   * @returns Hashed password string
   */
  async hash(
    plainPassword: string,
    saltRounds: number = this.defaultSaltRounds,
  ): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(plainPassword, salt);
  }

  /**
   * Compares a plain text password with a hashed password
   * @param plainPassword - Plain text password
   * @param hashedPassword - Hashed password to compare against
   * @returns True if passwords match, false otherwise
   */
  async compare(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Generates a secure random salt
   * @param rounds - Number of rounds for salt generation (default: 12)
   * @returns Generated salt string
   */
  async generateSalt(rounds: number = this.defaultSaltRounds): Promise<string> {
    return bcrypt.genSalt(rounds);
  }

  /**
   * Validates if a string is a valid bcrypt hash
   * @param hash - Hash string to validate
   * @returns True if valid bcrypt hash, false otherwise
   */
  isValidHash(hash: string): boolean {
    // Bcrypt hash pattern: $2[abxy]$[cost]$[22 character salt][31 character hash]
    const bcryptRegex = /^\$2[abxy]\$[0-9]{2}\$[./A-Za-z0-9]{53}$/;
    return bcryptRegex.test(hash);
  }
}
