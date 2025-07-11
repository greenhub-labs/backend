/**
 * AuthPrimitive
 * Primitive representation of the Auth entity for serialization and persistence
 *
 * @author GreenHub Labs
 */
export type AuthPrimitive = {
  id: string;
  userId: string;
  email: string;
  password: string; // Hashed password
  phone?: string;
  isVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};
