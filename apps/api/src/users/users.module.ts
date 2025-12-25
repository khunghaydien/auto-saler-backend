import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '@app/database';
import { UserEntity } from '@app/database/entities/user.entity';
import { UserRepository } from '@app/database/repositories/user.repository';
import { UsersService, AuthService } from '@app/users/services';
import { UsersController } from './users.controller';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '@app/users/strategies/jwt.strategy';
import { JwtAuthGuard, ConfigModule, ConfigService, LoggerMiddleware } from '@app/common';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.jwtSecret,
        signOptions: {
          expiresIn: configService.jwtExpiresIn,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService, AuthService, UserRepository, JwtStrategy, JwtAuthGuard],
  exports: [UsersService, AuthService, UserRepository, JwtStrategy],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
