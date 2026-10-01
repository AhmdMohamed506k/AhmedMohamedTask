import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../DB/users.Model.js';
import { RedisCacheService } from '../cache/redis-cache.service.js';
import { CacheStrategy } from '../cache/cache.enums.js';

@Injectable()
export class UsersService {



  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly redisCacheService: RedisCacheService,
  ) {}



  async getProfile(userId: string) {

   
    

    // Check if the user data is already cached in Redis
    const cachedUser = await this.redisCacheService.get<any>( CacheStrategy.USER_PROFILE, userId,);
    if (cachedUser) { return { source: 'cache', user: cachedUser };}

  


   // If not cached, fetch the user data from the database
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {throw new NotFoundException('User not found');}

    
    const userData = { id: user._id.toString(),name: user.name, email: user.email,};

    // Cache the user data in Redis for future requests
    await this.redisCacheService.set( CacheStrategy.USER_PROFILE, userId, userData, );

    return { source: 'database', user: userData };
  }
}