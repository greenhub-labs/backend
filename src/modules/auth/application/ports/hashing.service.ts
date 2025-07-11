/**
 * Token for HashingService dependency injection
 */
export const HASHING_SERVICE_TOKEN = Symbol('HashingService');

/**
 * HashingService port for password hashing operations
 * Defines the contract for password security operations
 *
 * @author GreenHub Labs
 */
export interface HashingService {
  /**
   * Hashes a plain text password using bcrypt
   * @param plainPassword - Plain text password to hash
   * @param saltRounds - Number of salt rounds (default: 12)
   * @returns Hashed password string
   */
  hash(plainPassword: string, saltRounds?: number): Promise<string>;

  /**
   * Compares a plain text password with a hashed password
   * @param plainPassword - Plain text password
   * @param hashedPassword - Hashed password to compare against
   * @returns True if passwords match, false otherwise
   */
  compare(plainPassword: string, hashedPassword: string): Promise<boolean>;

  /**
   * Generates a secure random salt
   * @param rounds - Number of rounds for salt generation (default: 12)
   * @returns Generated salt string
   */
  generateSalt(rounds?: number): Promise<string>;

  /**
   * Validates if a string is a valid bcrypt hash
   * @param hash - Hash string to validate
   * @returns True if valid bcrypt hash, false otherwise
   */
  isValidHash(hash: string): boolean;
}
