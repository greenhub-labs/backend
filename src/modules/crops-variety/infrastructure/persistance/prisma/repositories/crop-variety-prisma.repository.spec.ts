import { CropVarietyEntity } from '../../../../domain/entities/crop-variety.entity';
import { CropVarietyPrismaEntity } from '../entities/crop-variety-prisma.entity';
import { CropVarietyPrismaRepository } from './crop-variety-prisma.repository';

describe('CropVarietyPrismaRepository', () => {
  let repository: CropVarietyPrismaRepository;
  let prisma: any;

  const mockVariety = {
    id: 'variety-1',
    scientificName: 'Test',
    deletedAt: null,
  };
  const mockEntity = {
    id: { value: 'variety-1' },
  } as unknown as CropVarietyEntity;

  beforeEach(() => {
    prisma = {
      cropVariety: {
        findMany: jest.fn(),
        upsert: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        findFirst: jest.fn(),
      },
    };
    repository = new CropVarietyPrismaRepository(prisma as any);
    jest.spyOn(console, 'debug').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('findAll', () => {
    it('should return all crop varieties', async () => {
      prisma.cropVariety.findMany.mockResolvedValue([mockVariety]);
      jest
        .spyOn(CropVarietyPrismaEntity, 'fromPrisma')
        .mockReturnValue(mockEntity);
      const result = await repository.findAll();
      expect(prisma.cropVariety.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
      });
      expect(result).toEqual([mockEntity]);
    });
  });

  describe('save', () => {
    it('should upsert a crop variety', async () => {
      jest
        .spyOn(CropVarietyPrismaEntity, 'toPrismaCreate')
        .mockReturnValue({} as any);
      await repository.save(mockEntity);
      expect(prisma.cropVariety.upsert).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a crop variety if found', async () => {
      prisma.cropVariety.findUnique.mockResolvedValue(mockVariety);
      jest
        .spyOn(CropVarietyPrismaEntity, 'fromPrisma')
        .mockReturnValue(mockEntity);
      const result = await repository.findById('variety-1');
      expect(prisma.cropVariety.findUnique).toHaveBeenCalledWith({
        where: { id: 'variety-1', deletedAt: null },
      });
      expect(result).toEqual(mockEntity);
    });
    it('should return null if not found', async () => {
      prisma.cropVariety.findUnique.mockResolvedValue(null);
      const result = await repository.findById('variety-1');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a crop variety', async () => {
      jest
        .spyOn(CropVarietyPrismaEntity, 'toPrismaUpdate')
        .mockReturnValue({} as any);
      await repository.update(mockEntity);
      expect(prisma.cropVariety.update).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should soft delete a crop variety', async () => {
      await repository.delete('variety-1');
      expect(prisma.cropVariety.update).toHaveBeenCalledWith({
        where: { id: 'variety-1' },
        data: { deletedAt: expect.any(Date) },
      });
    });
  });

  describe('findByScientificName', () => {
    it('should return a crop variety if found', async () => {
      prisma.cropVariety.findFirst.mockResolvedValue(mockVariety);
      jest
        .spyOn(CropVarietyPrismaEntity, 'fromPrisma')
        .mockReturnValue(mockEntity);
      const result = await repository.findByScientificName('Test');
      expect(prisma.cropVariety.findFirst).toHaveBeenCalledWith({
        where: { scientificName: 'Test', deletedAt: null },
      });
      expect(result).toEqual(mockEntity);
    });
    it('should return null if not found', async () => {
      prisma.cropVariety.findFirst.mockResolvedValue(null);
      const result = await repository.findByScientificName('Test');
      expect(result).toBeNull();
    });
  });
});
