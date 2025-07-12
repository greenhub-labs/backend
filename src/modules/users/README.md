# Users Module

## Overview

The `users` module is a fully decoupled, DDD-compliant bounded context for user management. It is structured according to Clean Architecture principles, ensuring separation of concerns, testability, and scalability. The module handles user creation, update, deletion (soft delete), restoration, and querying, and is designed for extensibility and integration with external systems.

---

## Architecture

- **Domain Layer**: Contains the core business logic, entities, value objects, and domain events.
- **Application Layer**: Implements use cases as commands and queries, with their respective handlers. Handles orchestration, caching, and event publication.
- **Infrastructure Layer**: Provides concrete implementations for repositories (Prisma for persistence, Redis for caching), and event bus integrations (Kafka).
- **Presenters Layer**: Exposes the module's functionality via GraphQL resolvers, DTOs, and guards.

---

## Business Rules

- Users have unique identifiers (UUID), first and last names, avatar URLs, bios, and status flags (`isActive`, `isDeleted`).
- Soft delete is implemented: users are never physically removed, but flagged as deleted.
- Only users themselves can update or delete their own profiles (enforced in resolvers).
- Restoration of deleted users is possible (intended for admin use).
- All changes to user state emit domain events, which are published to both internal (NestJS CQRS) and external (Kafka) event buses.
- Caching is used for performance (cache-aside pattern with Redis).

---

## Commands

All commands are implemented as CQRS command handlers in the Application layer:

- **CreateUserCommand**: Creates a new user.
- **UpdateUserCommand**: Updates an existing user (only self-update allowed).
- **DeleteUserCommand**: Soft-deletes a user (only self-delete allowed).
- **RestoreUserCommand**: Restores a previously deleted user (admin only).

Each command handler:

- Validates and processes the command.
- Interacts with the domain (via factories and entities).
- Persists changes using the repository.
- Updates the cache.
- Publishes domain events to both NestJS and Kafka event buses.

---

## Queries

- **GetUserByIdQuery**: Retrieves a user by their unique identifier.
  - Implements cache-aside: checks Redis cache first, then falls back to the database (Prisma).

---

## Events

### Domain Events

- **UserCreatedDomainEvent**
- **UserUpdatedDomainEvent**
- **UserDeletedDomainEvent**
- **UserRestoredDomainEvent**

These are emitted by the User entity and handled within the application for further processing and integration.

### Integration Events

- **UserCreatedIntegrationEvent**: Published to Kafka for consumption by external systems. Triggered by the corresponding domain event.

---

## Event Handlers

- **UserCreatedIntegrationEventHandler**: Listens for `UserCreatedDomainEvent` and publishes a `UserCreatedIntegrationEvent` to Kafka.

---

## Integrations

- **Persistence**: Uses Prisma ORM for database operations.
- **Caching**: Uses Redis for user caching (cache-aside).
- **Event Bus**: Publishes events to both NestJS CQRS and Kafka (for integration with other services).
- **Authentication**: GraphQL resolvers are protected by JWT guards (integrated with the Auth module).

---

## GraphQL Resolvers

Resolvers are implemented in the Presenters layer and expose the following operations:

- **getUserById** (Query): Returns user information by ID (requires authentication).
- **createUser** (Mutation): Creates a new user (admin only; regular registration uses the Auth module).
- **updateUser** (Mutation): Updates the authenticated user's profile.
- **deleteUser** (Mutation): Soft-deletes the authenticated user's account.
- **restoreUser** (Mutation): Restores a soft-deleted user (admin only; role check TODO).

All resolvers use DTOs for input/output and map domain entities to response objects.

---

## Security

- All resolvers are protected by JWT authentication by default.
- Only the user themselves can update or delete their own profile (enforced in resolvers).
- Restoration is intended for admins (role check to be implemented).

---

## Extensibility

- The module is open for extension: new commands, queries, events, and integrations can be added with minimal impact on existing code.
- All dependencies are injected via tokens, allowing for easy replacement or mocking in tests.

---

## File Structure

```
users/
  application/
    commands/
      create-user/
      update-user/
      delete-user/
      restore-user/
    queries/
      get-user-by-id/
    event-handlers/
    events/
    ports/
    services/
    users-application.module.ts
  domain/
    entities/
    events/
    exceptions/
    factories/
    primitives/
    value-objects/
    users-domain.module.ts
  infrastructure/
    cache/
    persistance/
      prisma/
    users-infrastructure.module.ts
  presenters/
    graphql/
      resolvers/
      dtos/
      graphql.module.ts
    users.presenters.module.ts
  users.module.ts
```

---

## Testing

- Each command/query handler has its own unit tests.
- Domain logic is tested independently from infrastructure.

---

## How to Use

1. Import `UsersModule` in your root module.
2. Use GraphQL API for user management operations.
3. Listen to Kafka topics for integration events if you need to react to user lifecycle changes.

---

## Notes

- The module strictly follows SOLID principles and Clean Architecture.
- All value objects are prefixed with their module name for clarity.
- Only `pnpm` is supported for dependency management.

---

## Authors

GreenHub Labs Team
