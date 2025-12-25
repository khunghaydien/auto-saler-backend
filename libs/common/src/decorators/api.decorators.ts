import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from './common.decorators';

export function ApiLogin() {
  return applyDecorators(
    Public(),
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: 'User login' }),
    ApiResponse({ status: 200, description: 'Login successful' }),
    ApiResponse({ status: 401, description: 'Invalid credentials' }),
  );
}

export function ApiCreate(summary: string = 'Create a new resource') {
  return applyDecorators(
    Public(),
    HttpCode(HttpStatus.CREATED),
    ApiOperation({ summary }),
    ApiResponse({ status: 201, description: 'Resource successfully created' }),
    ApiResponse({ status: 409, description: 'Resource already exists' }),
  );
}

export function ApiGetAll(summary: string = 'Get all resources') {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({ status: 200, description: 'List of resources' }),
    ApiBearerAuth('JWT-auth'),
  );
}

export function ApiGetById(summary: string = 'Get resource by ID') {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({ status: 200, description: 'Resource found' }),
    ApiResponse({ status: 404, description: 'Resource not found' }),
    ApiBearerAuth('JWT-auth'),
  );
}

export function ApiUpdate(summary: string = 'Update resource') {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({ status: 200, description: 'Resource updated' }),
    ApiResponse({ status: 404, description: 'Resource not found' }),
    ApiBearerAuth('JWT-auth'),
  );
}

export function ApiDelete(summary: string = 'Delete resource') {
  return applyDecorators(
    HttpCode(HttpStatus.NO_CONTENT),
    ApiOperation({ summary }),
    ApiResponse({ status: 204, description: 'Resource deleted' }),
    ApiResponse({ status: 404, description: 'Resource not found' }),
    ApiBearerAuth('JWT-auth'),
  );
}

export function ApiProfile(summary: string = 'Get current user profile') {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse({ status: 200, description: 'User profile' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiBearerAuth('JWT-auth'),
  );
}
