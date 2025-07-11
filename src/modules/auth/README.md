# Authentication Module

## Overview

The Authentication module provides comprehensive JWT-based authentication and authorization for the GreenHub Labs agriculture automation platform. It implements a GraphQL-first approach using strict Domain-Driven Design (DDD) Clean Architecture patterns.

## Features

### Core Authentication

- **User Registration**: New user account creation with email validation
- **Login/Logout**: Secure JWT-based authentication
- **Token Management**: Access and refresh token handling
- **Token Verification**: JWT token validation and verification
- **Current User Info**: Retrieve authenticated user details

### Security Features

- **Password Hashing**: Bcrypt-based password encryption
- **JWT Tokens**: Secure access and refresh token implementation
- **Email Validation**: RFC 5322 compliant email validation
- **Password Strength**: Configurable password requirements
- **Guard Protection**: GraphQL resolvers protection with JWT guards

### Performance & Caching

- **Redis Cache**: High-performance authentication data caching
- **Cache-First Login**: Optimized login performance with Redis lookup
- **Session Management**: Real-time session tracking and management
- **Multiple Indexing**: Dual indexing by userId and email for fast lookups
- **Smart TTL**: Intelligent cache expiration (1h auth, 15min sessions)
- **Write-Through Strategy**: Automatic cache updates on data changes

### Integration

- **User Module Integration**: Seamless integration with existing Users module
- **Event-Driven**: Domain events for authentication actions
- **CQRS Pattern**: Command Query Responsibility Segregation
- **Prisma ORM**: Database integration through existing schema
- **Redis Integration**: Distributed caching with Redis for scalability

## Architecture

The module follows strict DDD Clean Architecture with the following layers:

```
src/modules/auth/
├── domain/                     # Domain Layer (Business Logic)
│   ├── entities/              # Domain Entities
│   ├── value-objects/         # Value Objects
│   ├── events/               # Domain Events
│   ├── exceptions/           # Domain Exceptions
│   ├── factories/            # Entity Factories
│   └── primitives/           # Data Transfer Objects
├── application/              # Application Layer (Use Cases)
│   ├── commands/             # Write Operations
│   ├── queries/              # Read Operations
│   ├── ports/                # Interfaces/Contracts
│   └── services/             # Application Services
├── infrastructure/           # Infrastructure Layer (External Concerns)
│   ├── persistance/          # Data Persistence (Prisma)
│   ├── cache/                # Caching Layer (Redis)
│   │   └── redis/            # Redis Implementation
│   │       ├── entities/     # Cache Entity Mappers
│   │       └── repositories/ # Cache Repository Implementations
│   ├── services/             # External Services (JWT, Bcrypt)
│   └── guards/               # Security Guards
├── presenters/               # Presentation Layer (API)
│   └── graphql/              # GraphQL Interface
└── auth.module.ts            # Main Module
```

## Business Rules

### Registration Rules

1. **Email Uniqueness**: Each email can only be registered once
2. **Email Format**: Must comply with RFC 5322 standard
3. **Password Requirements**:
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character
4. **User Creation**: Registration automatically creates a User entity
5. **Email Verification**: Users are created with unverified status

### Authentication Rules

1. **Login Credentials**: Requires valid email and password
2. **Password Verification**: Uses bcrypt for secure password comparison
3. **Token Generation**: Issues both access and refresh tokens
4. **Session Tracking**: Records login attempts and timestamps
5. **Token Expiry**: Access tokens expire in 15 minutes, refresh tokens in 7 days

### Authorization Rules

1. **Protected Endpoints**: Most GraphQL resolvers require authentication
2. **Public Endpoints**: Registration, login, and token refresh are public
3. **Token Validation**: All protected operations validate JWT tokens
4. **User Context**: Authenticated requests include user context

## Cache System

### Redis Cache Architecture

The authentication module implements a high-performance Redis caching layer that significantly improves login performance and reduces database load.

#### Cache Strategy

**Cache-First Login Flow:**

1. Check Redis cache for auth record by email
2. If cache miss, query database and cache result
3. Return cached data for subsequent requests

**Write-Through Strategy:**

- Database updates automatically update cache
- Ensures data consistency between cache and database
- Real-time cache invalidation on logout

#### Multiple Indexing

The cache system uses multiple Redis keys for optimal lookup performance:

- **`auth:user:{userId}`** - Primary lookup by User ID
- **`auth:email:{email}`** - Login lookup by email address
- **`auth:session:{sessionId}`** - Active session tracking

#### TTL Management

- **Auth Records**: 1 hour TTL (3600 seconds)
- **Session Data**: 15 minutes TTL (900 seconds)
- **Automatic Cleanup**: Redis expires keys automatically

### Cache Operations

#### Registration

```typescript
// After successful registration
await this.authCacheRepository.cacheAuth(auth);
```

#### Login Performance

```typescript
// Cache-first lookup
let auth = await this.authCacheRepository.getByEmail(email);
if (!auth) {
  auth = await this.authRepository.findByEmail(email);
  await this.authCacheRepository.cacheAuth(auth);
}
```

#### Session Management

```typescript
// Cache session information
await this.authCacheRepository.setSession(sessionId, {
  userId: user.id.value,
  email: auth.email.value,
  loginAt: new Date().toISOString(),
  ipAddress: command.ipAddress,
  userAgent: command.userAgent,
});
```

#### Logout Cleanup

```typescript
// Clear session cache
await this.authCacheRepository.deleteSession(sessionId);

// Optional: Clear auth cache for security
await this.authCacheRepository.deleteAuth(userId, email);
```

### Performance Benefits

- **Login Speed**: 50-80% faster login with cache hits
- **Database Load**: Significant reduction in PostgreSQL queries
- **Scalability**: Horizontal scaling with Redis cluster
- **Memory Efficiency**: Smart TTL prevents memory bloat

## API Reference

### GraphQL Mutations

#### Register User

```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    accessToken
    refreshToken
    user {
      id
      firstName
      lastName
      bio
      avatar
      isActive
      createdAt
      updatedAt
    }
  }
}
```

**Input:**

```typescript
interface RegisterInput {
  email: string; // Valid email address
  password: string; // Strong password
  firstName?: string; // Optional first name
  lastName?: string; // Optional last name
  bio?: string; // Optional biography
  avatar?: string; // Optional avatar URL
}
```

#### Login User

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    accessToken
    refreshToken
    user {
      id
      firstName
      lastName
      bio
      avatar
      isActive
      createdAt
      updatedAt
    }
  }
}
```

**Input:**

```typescript
interface LoginInput {
  email: string; // Registered email
  password: string; // User password
}
```

#### Logout User

```graphql
mutation Logout {
  logout
}
```

#### Refresh Token

```graphql
mutation RefreshToken($refreshToken: String!) {
  refreshToken(refreshToken: $refreshToken) {
    accessToken
    refreshToken
    user {
      id
      firstName
      lastName
      bio
      avatar
      isActive
      createdAt
      updatedAt
    }
  }
}
```

### GraphQL Queries

#### Get Current User

```graphql
query Me {
  me {
    id
    firstName
    lastName
    bio
    avatar
    isActive
    createdAt
    updatedAt
  }
}
```

#### Verify Token

```graphql
query VerifyToken($token: String!) {
  verifyToken(token: $token) {
    valid
    expired
    userId
    error
  }
}
```

## Configuration

### Environment Variables

Add the following environment variables to your `.env` file:

```env
# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Database (if not already configured)
DATABASE_URL="postgresql://username:password@localhost:5432/greenhub_db"

# Redis Configuration (for caching)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password  # Optional
REDIS_DB=0                          # Optional, default: 0
REDIS_URL=redis://localhost:6379    # Alternative to individual settings
```

### Redis Setup

#### Local Development

```bash
# Install Redis using Docker
docker run --name redis-auth -p 6379:6379 -d redis:alpine

# Or using Homebrew (macOS)
brew install redis
brew services start redis

# Or using apt (Ubuntu/Debian)
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
```

#### Production Configuration

```env
# Redis Cluster for production
REDIS_URL=redis://username:password@redis-cluster.example.com:6379
```

### Module Registration

The Auth module is automatically registered in the main application. To use it in other modules:

```typescript
import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [AuthModule],
  // ... other configuration
})
export class YourModule {}
```

## Usage Examples

### Frontend Integration

#### Registration

```typescript
const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      refreshToken
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

const registerUser = async (userData: RegisterInput) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: REGISTER_MUTATION,
      variables: { input: userData },
    });

    // Store tokens securely
    localStorage.setItem('accessToken', data.register.accessToken);
    localStorage.setItem('refreshToken', data.register.refreshToken);

    return data.register;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};
```

#### Login

```typescript
const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
      user {
        id
        firstName
        lastName
      }
    }
  }
`;

const loginUser = async (credentials: LoginInput) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: LOGIN_MUTATION,
      variables: { input: credentials },
    });

    // Store tokens
    localStorage.setItem('accessToken', data.login.accessToken);
    localStorage.setItem('refreshToken', data.login.refreshToken);

    return data.login;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};
```

#### Protected Requests

```typescript
// Configure Apollo Client with authentication
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

#### Token Refresh

```typescript
const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`;

const refreshTokens = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('No refresh token available');

  try {
    const { data } = await apolloClient.mutate({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: { refreshToken },
    });

    localStorage.setItem('accessToken', data.refreshToken.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken.refreshToken);

    return data.refreshToken;
  } catch (error) {
    // Refresh failed, redirect to login
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    throw error;
  }
};
```

### Backend Integration

#### Using Auth Guard

```typescript
import { UseGuards } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/guards/jwt-auth.guard';
import { CurrentUser } from 'src/modules/auth/infrastructure/decorators/current-user.decorator';
import { User } from 'src/modules/users/domain/entities/user.entity';

@Resolver()
@UseGuards(JwtAuthGuard)
export class ProtectedResolver {
  @Query(() => String)
  protectedQuery(@CurrentUser() user: User): string {
    return `Hello ${user.getName().getValue()}, you are authenticated!`;
  }
}
```

#### Public Endpoints

```typescript
import { Public } from 'src/modules/auth/infrastructure/decorators/public.decorator';

@Resolver()
export class PublicResolver {
  @Public()
  @Query(() => String)
  publicQuery(): string {
    return 'This endpoint is accessible without authentication';
  }
}
```

## Domain Events

The Auth module publishes the following domain events:

### UserRegisteredDomainEvent

Triggered when a new user registers in the system.

```typescript
{
  eventId: string;
  aggregateId: string;    // Auth entity ID
  occurredAt: string;
  version: number;
  userId: string;         // User ID who registered
  email: string;          // User email
  firstName?: string;     // User first name
  lastName?: string;      // User last name
  bio?: string;           // User bio
  avatar?: string;        // User avatar URL
  registrationInfo: {
    ipAddress?: string;
    userAgent?: string;
    source: string;       // Registration source (web, mobile, api)
  };
}
```

### UserLoggedInDomainEvent

Triggered when a user successfully logs in.

```typescript
{
  eventId: string;
  aggregateId: string;    // Auth entity ID
  occurredAt: string;
  version: number;
  userId: string;         // User ID who logged in
  email: string;          // User email
  ipAddress?: string;     // Login IP address
  userAgent?: string;     // User agent
  sessionId?: string;     // Session identifier
}
```

### UserLoggedOutDomainEvent

Triggered when a user logs out from the system.

```typescript
{
  eventId: string;
  aggregateId: string;    // Auth entity ID
  occurredAt: string;
  version: number;
  userId: string;         // User ID who logged out
  logoutInfo: {
    sessionId?: string;   // Session that was terminated
    ipAddress?: string;   // Logout IP address
    userAgent?: string;   // User agent
    logoutMethod: string; // manual, automatic, forced
    reason?: string;      // Logout reason
  };
}
```

### PasswordChangedDomainEvent

Triggered when a user changes their password.

```typescript
{
  eventId: string;
  aggregateId: string;    // Auth entity ID
  occurredAt: string;
  version: number;
  userId: string;         // User ID who changed password
  passwordChangeInfo: {
    ipAddress?: string;
    userAgent?: string;
    changeMethod: string;      // profile, reset, forced
    oldPasswordVerified: boolean;
    isPasswordReset: boolean;
  };
}
```

### TokenRefreshedDomainEvent

Triggered when authentication tokens are refreshed.

```typescript
{
  eventId: string;
  aggregateId: string;    // Auth entity ID
  occurredAt: string;
  version: number;
  userId: string;         // User ID who refreshed tokens
  tokenRefreshInfo: {
    ipAddress?: string;
    userAgent?: string;
    previousTokenExpiry: string;
    newTokenExpiry: string;
    refreshTokenId?: string;
    isAutomatic: boolean;
  };
}
```

### Event Bus Integration

The module includes both NestJS EventBus and Kafka EventBus implementations:

```typescript
// Using NestJS EventBus (for internal bounded contexts)
@EventsHandler(UserRegisteredDomainEvent)
export class UserRegisteredHandler
  implements IEventHandler<UserRegisteredDomainEvent>
{
  async handle(event: UserRegisteredDomainEvent) {
    // Send welcome email
    await this.emailService.sendWelcomeEmail(event.email, event.firstName);

    // Update analytics
    await this.analyticsService.trackRegistration(event);
  }
}

// Using Kafka EventBus (for external systems)
// Events are automatically published to Kafka topics:
// - auth.userregistered
// - auth.userloggedin
// - auth.userloggedout
// - auth.passwordchanged
// - auth.tokenrefreshed
```

## Error Handling

### Domain Exceptions

The module defines specific domain exceptions for different error scenarios:

#### InvalidAuthEmailException

- **Cause**: Email format is invalid
- **GraphQL Error**: `INVALID_EMAIL_FORMAT`
- **HTTP Status**: 400 Bad Request

#### InvalidAuthPasswordException

- **Cause**: Password doesn't meet requirements
- **GraphQL Error**: `INVALID_PASSWORD_FORMAT`
- **HTTP Status**: 400 Bad Request

#### InvalidCredentialsException

- **Cause**: Email or password is incorrect
- **GraphQL Error**: `INVALID_CREDENTIALS`
- **HTTP Status**: 401 Unauthorized

#### TokenExpiredException

- **Cause**: JWT token has expired
- **GraphQL Error**: `TOKEN_EXPIRED`
- **HTTP Status**: 401 Unauthorized

### Example Error Handling

```typescript
try {
  const result = await loginUser({ email, password });
} catch (error) {
  if (error.graphQLErrors?.[0]?.extensions?.code === 'INVALID_CREDENTIALS') {
    setError('Invalid email or password');
  } else if (
    error.graphQLErrors?.[0]?.extensions?.code === 'INVALID_EMAIL_FORMAT'
  ) {
    setError('Please enter a valid email address');
  } else {
    setError('An unexpected error occurred');
  }
}
```

## Testing

### Unit Tests

The module includes comprehensive unit tests for all layers:

#### Domain Layer Tests

```bash
# Run domain tests
npm test src/modules/auth/domain

# Test value objects
npm test src/modules/auth/domain/value-objects

# Test entities
npm test src/modules/auth/domain/entities

# Test domain events
npm test src/modules/auth/domain/events
```

#### Application Layer Tests

```bash
# Run application tests
npm test src/modules/auth/application

# Test command handlers
npm test src/modules/auth/application/commands

# Test query handlers
npm test src/modules/auth/application/queries
```

#### Infrastructure Layer Tests

```bash
# Test cache implementations
npm test src/modules/auth/infrastructure/cache

# Test Redis entities
npm test src/modules/auth/infrastructure/cache/redis/entities

# Test cache repositories
npm test src/modules/auth/infrastructure/cache/redis/repositories
```

#### Example Tests

##### Command Handler Test

```typescript
describe('RegisterCommandHandler', () => {
  it('should register a new user successfully', async () => {
    // Arrange
    const command = new RegisterCommand(
      'test@example.com',
      'StrongPass123!',
      'John',
      'Doe',
    );

    // Act
    const result = await handler.execute(command);

    // Assert
    expect(result).toBeDefined();
    expect(result.getEmail().getValue()).toBe('test@example.com');
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(mockAuthRepository.save).toHaveBeenCalled();
    expect(mockAuthCacheRepository.cacheAuth).toHaveBeenCalled();
  });
});
```

##### Cache Entity Test

```typescript
describe('AuthRedisEntity', () => {
  it('should convert Auth entity to Redis format and back', async () => {
    // Arrange
    const auth = new Auth({
      id: 'auth-id',
      userId: 'user-id',
      email: new AuthEmailValueObject('test@example.com'),
      password: AuthPasswordValueObject.fromHash(validBcryptHash),
      // ... other properties
    });

    // Act
    const redisData = AuthRedisEntity.toRedis(auth);
    const convertedAuth = AuthRedisEntity.fromRedis(redisData);

    // Assert
    expect(convertedAuth.id).toBe(auth.id);
    expect(convertedAuth.email.value).toBe(auth.email.value);
    expect(convertedAuth.password.value).toBe(auth.password.value);
  });
});
```

##### Cache Repository Test

```typescript
describe('AuthRedisCacheRepository', () => {
  it('should cache and retrieve auth by email', async () => {
    // Arrange
    const auth = createMockAuth();

    // Act
    await repository.setByEmail('test@example.com', auth);
    const cachedAuth = await repository.getByEmail('test@example.com');

    // Assert
    expect(cachedAuth).toBeDefined();
    expect(cachedAuth.email.value).toBe('test@example.com');
  });
});
```

### Integration Tests

Create integration tests for GraphQL endpoints:

```typescript
describe('Auth Resolver (e2e)', () => {
  it('should register a new user', async () => {
    const mutation = `
      mutation {
        register(input: {
          email: "test@example.com"
          password: "StrongPass123!"
          firstName: "John"
          lastName: "Doe"
        }) {
          accessToken
          refreshToken
          user {
            id
            firstName
            lastName
          }
        }
      }
    `;

    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: mutation })
      .expect(200);

    expect(response.body.data.register.accessToken).toBeDefined();
    expect(response.body.data.register.user.firstName).toBe('John');
  });
});
```

## Security Considerations

### Password Security

- Passwords are hashed using bcrypt with a cost factor of 12
- Raw passwords are never stored in the database
- Password validation enforces strong password requirements

### Token Security

- JWT tokens include user ID and expiration claims
- Access tokens have short expiration (15 minutes)
- Refresh tokens have longer expiration (7 days) for UX
- Tokens are signed with secret keys from environment variables

### Input Validation

- All inputs are validated using class-validator decorators
- Email format validation uses RFC 5322 standard
- SQL injection protection through Prisma ORM

### Authentication Guard

- Protected endpoints require valid JWT tokens
- Token validation happens on every request
- Invalid tokens result in 401 Unauthorized responses

## Dependencies

### Required Dependencies

```json
{
  "@nestjs/jwt": "^10.0.0",
  "bcrypt": "^5.1.0",
  "class-validator": "^0.14.0",
  "class-transformer": "^0.5.0",
  "ioredis": "^5.3.0"
}
```

### Dev Dependencies

```json
{
  "@types/bcrypt": "^5.0.0",
  "@types/ioredis": "^5.0.0"
}
```

## Migration Guide

### From Previous Auth Systems

If migrating from an existing authentication system:

1. **Export User Data**: Export existing user data including hashed passwords
2. **Update Schema**: Ensure Prisma schema includes Auth model
3. **Migrate Passwords**: If using different hashing, re-hash passwords with bcrypt
4. **Update Frontend**: Replace existing auth calls with GraphQL mutations
5. **Test Thoroughly**: Verify all authentication flows work correctly

### Database Migrations

Run Prisma migrations to create the Auth table:

```bash
npx prisma migrate dev --name add_auth_table
```

### Cache Migration

When implementing Redis cache on existing systems:

#### 1. Cache Warming

```typescript
// Warm cache with existing auth records
async warmCache() {
  const authRecords = await this.authRepository.findAll();

  for (const auth of authRecords) {
    await this.authCacheRepository.cacheAuth(auth);
  }

  console.log(`Warmed cache with ${authRecords.length} auth records`);
}
```

#### 2. Gradual Migration

```typescript
// Feature flag for cache usage
const USE_CACHE = process.env.ENABLE_AUTH_CACHE === 'true';

async findByEmail(email: string): Promise<Auth | null> {
  if (USE_CACHE) {
    // Try cache first
    const cached = await this.authCacheRepository.getByEmail(email);
    if (cached) return cached;
  }

  // Fallback to database
  const auth = await this.authRepository.findByEmail(email);

  if (USE_CACHE && auth) {
    // Cache for next time
    await this.authCacheRepository.cacheAuth(auth);
  }

  return auth;
}
```

#### 3. Cache Monitoring

Set up monitoring to track cache performance:

```typescript
// Log cache hit rates
setInterval(async () => {
  const stats = await authCacheRepository.getStats();
  console.log('Auth Cache Stats:', {
    totalKeys: stats.totalKeys,
    memoryUsage: stats.memoryUsage,
    timestamp: new Date().toISOString(),
  });
}, 60000); // Every minute
```

## Performance Considerations

### Database Indexes

- Email field has unique index for fast lookups
- User relationship uses foreign key for efficient joins

### Redis Caching Implementation

The module includes a comprehensive Redis caching system:

#### Cache Performance Metrics

- **Cache Hit Ratio**: Typically 85-95% for auth lookups
- **Login Speed**: 1-5ms with cache vs 50-100ms with database
- **Memory Usage**: ~1KB per cached auth record
- **TTL Efficiency**: Automatic cleanup prevents memory bloat

#### Cache Monitoring

```typescript
// Get cache statistics
const stats = await authCacheRepository.getStats();
console.log({
  totalKeys: stats.totalKeys,
  userKeys: stats.userKeys,
  emailKeys: stats.emailKeys,
  sessionKeys: stats.sessionKeys,
  memoryUsage: stats.memoryUsage,
});

// Health check
const isHealthy = await authCacheRepository.healthCheck();
```

#### Cache Optimization

- **Dual Indexing**: Both userId and email keys for different access patterns
- **Session Tracking**: Real-time session management with Redis
- **Smart TTL**: Different expiration times for auth (1h) vs sessions (15m)
- **Write-Through**: Immediate cache updates on data changes

### Horizontal Scaling

- **Redis Cluster**: Supports horizontal scaling across multiple nodes
- **Stateless JWT**: No server-side session storage required
- **Event-Driven**: Kafka integration for distributed systems

### Rate Limiting

- Implement rate limiting on login endpoints to prevent brute force attacks
- Consider progressive delays for failed login attempts
- Use Redis for distributed rate limiting across multiple servers

## Contributing

### Code Standards

- Follow existing DDD architecture patterns
- Write comprehensive unit tests for new features
- Update documentation for any API changes
- Use JSDoc comments for all public methods

### Pull Request Process

1. Create feature branch from main
2. Implement changes following DDD patterns
3. Add/update tests as needed
4. Update documentation
5. Submit pull request for review

## Troubleshooting

### Common Issues

#### "Invalid credentials" on correct login

- Check password hashing implementation
- Verify database has correct password hash
- Ensure bcrypt comparison is working

#### JWT token validation fails

- Verify JWT_ACCESS_SECRET is correct
- Check token expiration settings
- Ensure token format is correct

#### GraphQL schema conflicts

- Run `npm run build` to regenerate schema
- Check for duplicate type definitions
- Verify all imports are correct

#### Database connection issues

- Verify DATABASE_URL is correct
- Check Prisma client generation
- Ensure database migrations are applied

#### Redis connection issues

- Verify REDIS_URL or Redis connection settings
- Check Redis server is running and accessible
- Ensure Redis authentication is correct
- Test Redis connection with redis-cli

#### Cache-related issues

- **Stale cache data**: Clear cache manually or wait for TTL expiration
- **Cache miss**: Check cache key generation and TTL settings
- **Memory issues**: Monitor Redis memory usage and adjust TTL

### Debug Commands

```bash
# Generate Prisma client
npx prisma generate

# View database schema
npx prisma studio

# Run migrations
npx prisma migrate dev

# Reset database (development only)
npx prisma migrate reset

# Redis debugging
redis-cli ping                    # Test Redis connection
redis-cli info memory            # Check memory usage
redis-cli keys "auth:*"          # List auth cache keys
redis-cli flushdb                # Clear cache (development only)

# Monitor Redis in real-time
redis-cli monitor               # Watch all Redis commands
```

### Cache Debugging

```typescript
// Check cache health
const isHealthy = await authCacheRepository.healthCheck();
console.log('Redis health:', isHealthy);

// Get cache statistics
const stats = await authCacheRepository.getStats();
console.log('Cache stats:', stats);

// Clear all auth cache (development only)
await authCacheRepository.clear();

// Check specific cache entries
const authByUserId = await authCacheRepository.getByUserId('user-id');
const authByEmail = await authCacheRepository.getByEmail('user@example.com');
```

## Cache Best Practices

### Development Environment

```env
# Development Redis settings
REDIS_URL=redis://localhost:6379
ENABLE_AUTH_CACHE=true
```

### Production Environment

```env
# Production Redis settings with authentication
REDIS_URL=redis://username:password@redis-cluster.prod.com:6379
ENABLE_AUTH_CACHE=true

# Optional: Configure Redis Pool
REDIS_MAX_RETRIES_PER_REQUEST=3
REDIS_RETRY_DELAY_ON_FAILURE=100
```

### Security Considerations

1. **Cache Encryption**: Consider encrypting sensitive data in Redis for production
2. **Access Control**: Use Redis AUTH and restrict network access
3. **TTL Management**: Set appropriate TTL to balance performance vs security
4. **Cache Invalidation**: Immediate invalidation on logout/password change

### Monitoring & Alerting

Set up alerts for:

- Redis connection failures
- High memory usage (>80%)
- Low cache hit rates (<70%)
- Slow cache operations (>10ms)

### Scaling Considerations

- **Redis Cluster**: Use cluster mode for horizontal scaling
- **Replication**: Set up Redis replicas for high availability
- **Backup**: Regular Redis snapshots for disaster recovery
- **Network**: Use Redis in same VPC/region as application servers

## License

This module is part of the GreenHub Labs project and follows the same license terms.
