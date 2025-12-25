import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '@app/users/services';
import { LoginDto, AuthResponseDto, UserResponseDto } from '@app/users/dto';
import { JwtAuthGuard, CurrentUser, ApiLogin, ApiProfile } from '@app/common';
import { UserEntity } from '@app/database/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiLogin()
  @ApiResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiProfile()
  @ApiResponse({ status: 200, description: 'User profile', type: UserResponseDto })
  async getProfile(@CurrentUser() user: UserEntity): Promise<UserResponseDto> {
    return this.authService.getProfile(user.id);
  }
}
