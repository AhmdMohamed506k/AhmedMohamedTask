import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User, UserSchema } from '../DB/users.Model.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js'; 
import { RedisCacheModule } from '../cache/redis-cache.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'supersecretkey',
        signOptions: { expiresIn: '1d' },
      }),
    }),
    RedisCacheModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAuthGuard, 
  ],
  exports: [
    AuthService,
    JwtAuthGuard, 
    JwtModule,
  ],
})
export class AuthModule {}