import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';

/**
 * Custom Bad Request Exception
 */
export class CustomBadRequestException extends BadRequestException {
  constructor(message: string | object) {
    super(message);
  }
}

/**
 * Custom Not Found Exception
 * @param resource - Resource name (e.g., 'User', 'Product')
 * @param identifier - Optional identifier (ID, email, etc.)
 */
export class CustomNotFoundException extends NotFoundException {
  constructor(resource: string, identifier?: string | number) {
    const message = identifier
      ? `${resource} with identifier ${identifier} not found`
      : `${resource} not found`;
    super(message);
  }
}

/**
 * Custom Unauthorized Exception
 */
export class CustomUnauthorizedException extends UnauthorizedException {
  constructor(message?: string) {
    super(message || 'Unauthorized access');
  }
}

/**
 * Custom Forbidden Exception
 */
export class CustomForbiddenException extends ForbiddenException {
  constructor(message?: string) {
    super(message || 'Access forbidden');
  }
}

/**
 * Custom Conflict Exception
 * Used when a resource conflict occurs (e.g., duplicate email)
 */
export class CustomConflictException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}
