import { UserPrismaRepository } from './user-prisma.repository';
import { User } from '../../../../domain/entities/user.entity';
import { UserPrismaEntity } from '../entities/user-prisma.entity';

jest.mock('../entities/user-prisma.entity');

const mockPrisma = () => ({
  user: {
    findUnique: jest.fn(),
    upsert: jest.fn(),
    update: jest.fn(),
  },
});

describe('UserPrismaRepository', () => {
  let repository: UserPrismaRepository;
  let prisma: ReturnType<typeof mockPrisma>;
  const user = { id: { value: 'user-1' } } as unknown as User;
  const prismaUser = { id: 'user-1' };

  beforeEach(() => {
    prisma = mockPrisma();
    repository = new UserPrismaRepository(prisma as any);
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return User if found', async () => {
      prisma.user.findUnique.mockResolvedValue(prismaUser);
      (UserPrismaEntity.fromPrisma as jest.Mock).mockReturnValue(user);
      const result = await repository.findById('user-1');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
      expect(result).toBe(user);
    });
    it('should return null if not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      const result = await repository.findById('user-1');
      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('should upsert user and return id', async () => {
      (UserPrismaEntity.toPrisma as jest.Mock).mockReturnValue(prismaUser);
      prisma.user.upsert.mockResolvedValue(prismaUser);
      const result = await repository.save(user);
      expect(UserPrismaEntity.toPrisma).toHaveBeenCalledWith(user);
      expect(prisma.user.upsert).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        update: prismaUser,
        create: prismaUser,
      });
      expect(result).toBe('user-1');
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      (UserPrismaEntity.toPrisma as jest.Mock).mockReturnValue(prismaUser);
      await repository.update(user);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: prismaUser,
      });
    });
  });

  describe('softDelete', () => {
    it('should soft delete user by setting deletedAt', async () => {
      const now = new Date();
      jest.spyOn(global, 'Date').mockImplementation(() => now as any);
      await repository.softDelete('user-1');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { deletedAt: now },
      });
      (global.Date as any).mockRestore && (global.Date as any).mockRestore();
    });
  });
});
