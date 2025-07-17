/**
 * PlotsPrimitive
 * Primitive representation of the Plots entity for serialization and persistence
 */
export type PlotsPrimitive = {
  id: string;
  name: string;
  description: string;
  width: number;
  length: number;
  height: number;
  area: number;
  perimeter: number;
  volume: number;
  unitMeasurement: string;
  status: string;
  soilType: string;
  soilPh: number;
  farmId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};
