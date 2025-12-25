import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'User ID' })
  id: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  email: string;

  @ApiPropertyOptional({ example: 'username', description: 'Username' })
  username: string | null;

  @ApiPropertyOptional({ example: 'John Doe', description: 'Full name' })
  fullName: string | null;

  @ApiPropertyOptional({ example: '+1234567890', description: 'Phone number' })
  phone: string | null;

  @ApiProperty({ example: true, description: 'User active status' })
  isActive: boolean;

  @ApiProperty({ example: false, description: 'Email verified status' })
  isEmailVerified: boolean;

  @ApiPropertyOptional({ example: '2024-01-01T00:00:00.000Z', description: 'Last login timestamp' })
  lastLoginAt: Date | null;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Last update timestamp' })
  updatedAt: Date;
}
