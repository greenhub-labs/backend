import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import { ConflictException } from '@nestjs/common';
import { RegisterCommandHandler } from './register.command-handler';
import { RegisterCommand } from './register.command';
import { AuthFactory } from '../../../domain/factories/auth/auth.factory';
import {
  AuthRepository,
  AUTH_REPOSITORY_TOKEN,
} from '../../ports/auth.repository';
import {
  HashingService,
  HASHING_SERVICE_TOKEN,
} from '../../ports/hashing.service';
import { TokenService, TOKEN_SERVICE_TOKEN } from '../../ports/token.service';
import { CreateUserCommand } from '../../../../users/application/commands/create-user/create-user.command';
import { User } from '../../../../users/domain/entities/user.entity';
import { Auth } from '../../../domain/entities/auth.entity';

describe('RegisterCommandHandler', () => {
  let handler: RegisterCommandHandler;
  let authFactory: jest.Mocked<AuthFactory>;
  let authRepository: jest.Mocked<AuthRepository>;
  let hashingService: jest.Mocked<HashingService>;
  let tokenService: jest.Mocked<TokenService>;
  let commandBus: jest.Mocked<CommandBus>;

  beforeEach(async () => {
    const mockAuthFactory = {
      createForRegistration: jest.fn(),
    };

    const mockAuthRepository = {
      emailExists: jest.fn(),
      save: jest.fn(),
    };

    const mockHashingService = {
      hash: jest.fn(),
    };

    const mockTokenService = {
      generateTokenPair: jest.fn(),
    };

    const mockCommandBus = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterCommandHandler,
        {
          provide: AuthFactory,
          useValue: mockAuthFactory,
        },
        {
          provide: AUTH_REPOSITORY_TOKEN,
          useValue: mockAuthRepository,
        },
        {
          provide: HASHING_SERVICE_TOKEN,
          useValue: mockHashingService,
        },
        {
          provide: TOKEN_SERVICE_TOKEN,
          useValue: mockTokenService,
        },
        {
          provide: CommandBus,
          useValue: mockCommandBus,
        },
      ],
    }).compile();

    handler = module.get<RegisterCommandHandler>(RegisterCommandHandler);
    authFactory = module.get(AuthFactory);
    authRepository = module.get(AUTH_REPOSITORY_TOKEN);
    hashingService = module.get(HASHING_SERVICE_TOKEN);
    tokenService = module.get(TOKEN_SERVICE_TOKEN);
    commandBus = module.get(CommandBus);
  });

  describe('execute', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const command = new RegisterCommand(
        'test@example.com',
        'StrongPassword123!',
        'John',
        'Doe',
        '+1234567890',
      );

      const mockUser = { id: { value: 'user-id' } } as User;
      const mockAuth = { id: 'auth-id' } as Auth;
      const mockTokens = {
        accessToken: {
          value: 'access-token',
        },
        refreshToken: {
          value: 'refresh-token',
        },
      } as any;

      authRepository.emailExists.mockResolvedValue(false);
      commandBus.execute.mockResolvedValue(mockUser);
      hashingService.hash.mockResolvedValue('hashed-password');
      authFactory.createForRegistration.mockReturnValue(mockAuth);
      authRepository.save.mockResolvedValue('auth-id');
      tokenService.generateTokenPair.mockResolvedValue(mockTokens);

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(authRepository.emailExists).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(CreateUserCommand),
      );
      expect(hashingService.hash).toHaveBeenCalledWith('StrongPassword123!');
      expect(authFactory.createForRegistration).toHaveBeenCalledWith({
        userId: 'user-id',
        email: 'test@example.com',
        hashedPassword: 'hashed-password',
        phone: '+1234567890',
      });
      expect(authRepository.save).toHaveBeenCalledWith(mockAuth);
      expect(tokenService.generateTokenPair).toHaveBeenCalledWith({
        sub: 'user-id',
        email: 'test@example.com',
        sessionId: expect.any(String),
      });

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: mockUser,
      });
    });

    it('should throw ConflictException when email already exists', async () => {
      // Arrange
      const command = new RegisterCommand(
        'existing@example.com',
        'StrongPassword123!',
      );

      authRepository.emailExists.mockResolvedValue(true);

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow(ConflictException);
      expect(authRepository.emailExists).toHaveBeenCalledWith(
        'existing@example.com',
      );
    });

    it('should validate password requirements', async () => {
      // Arrange
      const command = new RegisterCommand(
        'test@example.com',
        'weak', // Invalid password
      );

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow();
    });
  });
});
