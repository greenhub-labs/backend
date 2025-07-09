/**
 * UserPrimitive
 * Primitive representation of the User entity for serialization and persistence
 */
export type UserPrimitive = {
  id: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};
