/**
 * CropsPrimitive
 * Primitive representation of the Crops entity for serialization and persistence
 */
export type CropPrimitive = {
  id: string;
  plotId: string;
  varietyId: string;
  plantingDate: string;
  expectedHarvest: string;
  actualHarvest: string;
  quantity: number;
  status: string;
  plantingMethod: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};
