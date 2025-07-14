/**
 * FarmsPrimitive
 * Primitive representation of the Farms entity for serialization and persistence
 */
export type FarmsPrimitive = {
  // TODO: Define primitive properties
  id: string;
  name: string;
  description: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  street: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};
