import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Type,
} from '@nestjs/common';
import { Response } from 'express';
import { InvalidDebtStatusException } from 'src/debts/domain/exceptions/invalid-debt-status.exception';
import { InvalidAmountException as DebtsInvalidAmountException } from 'src/debts/domain/exceptions/invalid-debt-amount.exception';
import { InvalidCurrencyException as DebtsInvalidCurrencyException } from 'src/debts/domain/exceptions/invalid-debt-currency.exception';
import { ExpenseNotFoundException } from 'src/expenses/domain/exceptions/expense-not-found.exception';
import { InvalidAmountException as ExpensesInvalidAmountException } from 'src/expenses/domain/exceptions/invalid-amount.exception';
import { InvalidSplitTypeException } from 'src/expenses/domain/exceptions/invalid-split-type.exception';
import { InvalidCurrencyException as ExpensesInvalidCurrencyException } from 'src/expenses/domain/exceptions/invalid-currency.exception copy';
import { InvalidNameException } from 'src/expenses/domain/exceptions/invalid-name.exception';
import { GroupNotFoundException } from 'src/groups/domain/exceptions/group-not-found.exception';
import { InvalidGroupException } from 'src/groups/domain/exceptions/invalid-group.exception';
import { InvalidGroupNameException } from 'src/groups/domain/exceptions/invalid-group-name.exception';
import { MembershipNotFoundException } from 'src/memberships/domain/exceptions/membership-not-found.exception';
import { MembershipAlreadyExistsException } from 'src/memberships/domain/exceptions/member-already-exists.exception';
import { IsNotAMemberException } from 'src/memberships/domain/exceptions/is-not-a-member.exception';
import { InvalidUserException } from 'src/user/domain/exceptions/invalid-user.exception';
import { InvalidActionException } from 'src/notification/domain/exceptions/invalid-action.exception';
import { InvalidMessageException } from 'src/notification/domain/exceptions/invalid-message.exception';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';
import { InvalidEmailException } from 'src/auth/domain/exceptions/invalid-email.exception';
import { InvalidFullNameException } from 'src/user/domain/exceptions/invalid-full-name.exception';
import { UserNotFoundException } from 'src/user/domain/exceptions/user-not-found.exception';

/**
 * Filter that catches and handles domain exceptions thrown by the application
 * Maps domain exceptions to appropriate HTTP status codes and formats error responses
 */
@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  /**
   * Map of domain exceptions to their corresponding HTTP status codes
   */
  private readonly exceptionMap = new Map<Type<DomainException>, HttpStatus>([
    // User
    [UserNotFoundException, HttpStatus.NOT_FOUND],
    [InvalidEmailException, HttpStatus.BAD_REQUEST],
    [InvalidFullNameException, HttpStatus.BAD_REQUEST],
    [InvalidUserException, HttpStatus.BAD_REQUEST],
    // Groups
    [GroupNotFoundException, HttpStatus.NOT_FOUND],
    [InvalidGroupException, HttpStatus.BAD_REQUEST],
    [InvalidGroupNameException, HttpStatus.BAD_REQUEST],
    // Memberships
    [MembershipNotFoundException, HttpStatus.NOT_FOUND],
    [MembershipAlreadyExistsException, HttpStatus.CONFLICT],
    [IsNotAMemberException, HttpStatus.FORBIDDEN],
    // Debts
    [InvalidDebtStatusException, HttpStatus.BAD_REQUEST],
    [DebtsInvalidAmountException, HttpStatus.BAD_REQUEST],
    [DebtsInvalidCurrencyException, HttpStatus.BAD_REQUEST],
    // Expenses
    [ExpenseNotFoundException, HttpStatus.NOT_FOUND],
    [ExpensesInvalidAmountException, HttpStatus.BAD_REQUEST],
    [InvalidSplitTypeException, HttpStatus.BAD_REQUEST],
    [ExpensesInvalidCurrencyException, HttpStatus.BAD_REQUEST],
    [InvalidNameException, HttpStatus.BAD_REQUEST],
    // Notification
    [InvalidActionException, HttpStatus.BAD_REQUEST],
    [InvalidMessageException, HttpStatus.BAD_REQUEST],
  ]);

  /**
   * Catches and handles exceptions by converting them to HTTP responses
   * @param exception - The caught exception
   * @param host - The arguments host providing access to the underlying platform-specific request/response
   */
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      this.exceptionMap.get(exception.constructor as Type<DomainException>) ||
      HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.name,
      timestamp: new Date().toISOString(),
    });
  }
}
