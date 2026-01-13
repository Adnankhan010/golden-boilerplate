import { Controller, Post, Get, Query, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() req) {
        // In real app, use LocalGuard strategy
        const user = await this.authService.validateUser(req.email, req.password);
        if (!user) {
            throw new Error("Invalid credentials");
        }
        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body() req) {
        return this.authService.register(req);
    }

    @Get('verify')
    async verify(@Query('token') token: string) {
        return this.authService.verifyEmail(token);
    }
}
