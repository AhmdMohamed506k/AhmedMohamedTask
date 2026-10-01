
import { Model } from 'mongoose';
import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { User, UserDocument } from '../DB/users.Model.js';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService, } from '@nestjs/jwt';
import { RedisCacheService } from '../cache/redis-cache.service.js';
import { SignUpDto } from './DTO/Signup.dto.js';

import * as bcrypt from 'bcryptjs';
import { CacheStrategy, CacheTTL } from '../cache/cache.enums.js';
import { SignInDto } from './DTO/Singin.dto.js';



@Injectable()
export class AuthService {




    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly jwtService: JwtService,
        private readonly RedisCacheService: RedisCacheService
    ) { }




    async signup(signUpDto: SignUpDto) {



        const { name, email, password } = signUpDto;

        try {


            //Check if the user already exists in the database
            const UserExists = await this.userModel.findOne({ email });
            if (UserExists) { throw new BadRequestException('User already exists') }


            

            //Hash the password before saving it to the database
            const HashedPassword = await bcrypt.hash(password, 10);

            //Create a new user in the database with the hashed password
            const newUser = await this.userModel.create({ name, email, password: HashedPassword });



            //Create a JWT token for the new user and return it along with the user data
            const token = this.generateToken(newUser._id.toString(), newUser.email);


            // Cache the user data in Redis for faster retrieval in future requests
            const userData = { id: newUser._id.toString(), name: newUser.name, email: newUser.email };

            // store the user data in Redis with a TTL of 1 day (86400 seconds)
            await this.RedisCacheService.set(CacheStrategy.USER_PROFILE, newUser._id.toString(), userData, CacheTTL.DAY);

            // return the user data and token to the client
            return { message: 'User registered successfully', accessToken: token, user: userData };



        } catch (error: any) {
            // handle errors that may occur during the signup process
            if (error instanceof HttpException) {
                throw error;
            }

            // if the error is a MongoDB duplicate key error (code 11000), it means that the email is already registered
            if (error.code === 11000) {
                throw new ConflictException('Email is already registered');
            }

            // return a generic internal server error for any other errors that may occur
            throw new InternalServerErrorException(
                error.message || 'Error registering user',
            );

        }
    }

    async signIn(signInDto: SignInDto) {



        const { email, password } = signInDto;



        // First, check if the user exists in the database
        const user = await this.userModel.findOne({ email });
        if (!user) { throw new UnauthorizedException('Invalid email or password'); }



        // Next, compare the provided password with the hashed password stored in the database
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) { throw new UnauthorizedException('Invalid email or password'); }



        // If the user exists and the password matches, generate a JWT token for the user
        const token = this.generateToken(user._id.toString(), user.email);




        const userData = { id: user._id.toString(), name: user.name, email: user.email, };

        // Cache the user data in Redis for faster retrieval in future requests
        await this.RedisCacheService.set(CacheStrategy.USER_PROFILE, user._id.toString(), userData);


        // Return the user data and token to the client
        return { message: 'Logged in successfully', accessToken: token, user: userData, };
    }

    private generateToken(userId: string, email: string): string {

        return this.jwtService.sign({ sub: userId, email });
    }
}











