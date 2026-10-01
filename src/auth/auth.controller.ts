

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { SignUpDto } from './DTO/Signup.dto.js';
import { SignInDto } from './DTO/Singin.dto.js';

@Controller("Auth")
export class AuthController {



    constructor(private readonly authService: AuthService) { }


    @Post('signup')
    async signup(@Body() signUpDto: SignUpDto) {
        return await this.authService.signup(signUpDto);
    }



    @HttpCode(HttpStatus.OK)
    @Post('signin')
    async signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto);
    }







}



