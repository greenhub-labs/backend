import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Type,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

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
    // [UserNotFoundException, HttpStatus.NOT_FOUND],
    // [InvalidEmailException, HttpStatus.BAD_REQUEST],
    // [InvalidFullNameException, HttpStatus.BAD_REQUEST],
    // [InvalidUserException, HttpStatus.BAD_REQUEST],
    // Groups
    // [GroupNotFoundException, HttpStatus.NOT_FOUND],
    // [InvalidGroupException, HttpStatus.BAD_REQUEST],
    // [InvalidGroupNameException, HttpStatus.BAD_REQUEST],
    // Memberships
    // [MembershipNotFoundException, HttpStatus.NOT_FOUND],
    // [MembershipAlreadyExistsException, HttpStatus.CONFLICT],
    // [IsNotAMemberException, HttpStatus.FORBIDDEN],
    // Debts
    // [InvalidDebtStatusException, HttpStatus.BAD_REQUEST],
    // [DebtsInvalidAmountException, HttpStatus.BAD_REQUEST],
    // [DebtsInvalidCurrencyException, HttpStatus.BAD_REQUEST],
    // Expenses
    // [ExpenseNotFoundException, HttpStatus.NOT_FOUND],
    // [ExpensesInvalidAmountException, HttpStatus.BAD_REQUEST],
    // [InvalidSplitTypeException, HttpStatus.BAD_REQUEST],
    // [ExpensesInvalidCurrencyException, HttpStatus.BAD_REQUEST],
    // [InvalidNameException, HttpStatus.BAD_REQUEST],
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
