import { Module } from '@nestjs/common';
import { CreateUserCommandHandler } from './commands/create-user/create-user.command-handler';
import { UpdateUserCommandHandler } from './commands/update-user/update-user.command-handler';
import { DeleteUserCommandHandler } from './commands/delete-user/delete-user.command-handler';
import { RestoreUserCommandHandler } from './commands/restore-user/restore-user.command-handler';
import { GetUserByIdQueryHandler } from './queries/get-user-by-id/get-user-by-id.query-handler';

/**
 * UsersApplicationModule
 * Application layer for Users (DDD Clean Architecture)
 */
@Module({
  providers: [
    CreateUserCommandHandler,
    UpdateUserCommandHandler,
    DeleteUserCommandHandler,
    RestoreUserCommandHandler,
    GetUserByIdQueryHandler,
  ],
  exports: [
    CreateUserCommandHandler,
    UpdateUserCommandHandler,
    DeleteUserCommandHandler,
    RestoreUserCommandHandler,
    GetUserByIdQueryHandler,
  ],
})
export class UsersApplicationModule {}
