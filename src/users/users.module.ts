import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';
import { User, UserSchema } from '../DB/users.Model.js';
import { AuthModule } from '../auth/auth.module.js';
import { RedisCacheModule } from '../cache/redis-cache.module.js';

@Module({
      imports: [
            MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
            AuthModule,        
            RedisCacheModule,  
      ],
      controllers: [UsersController],
      providers: [UsersService],
      exports: [UsersService],
})
export class UsersModule { }