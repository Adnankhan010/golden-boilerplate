import { Controller, Post, Get, Query, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
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

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
        // Initiates the Google OAuth flow
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req) {
        // Handles the callback from Google
        // Logic: if user is logged in successfully by strategy, check status
        const user = req.user;
        if (!user) {
            return { message: 'Authentication failed' };
        }
        // If status is PENDING/UNVERIFIED, we might redirect to a "Pending" page on frontend
        // If ACTIVE, we generate token

        // For simplicity, we assume strict Double Lock logic from AuthService
        // logic should roughly match login() but we might need to handle the initial redirect
        return this.authService.login(user);
    }

    @Get('facebook')
    @UseGuards(AuthGuard('facebook'))
    async facebookAuth() {
        // Initiates the Facebook OAuth flow
    }

    @Get('facebook/callback')
    @UseGuards(AuthGuard('facebook'))
    async facebookAuthRedirect(@Req() req) {
        const user = req.user;
        if (!user) {
            return { message: 'Authentication failed' };
        }
        return this.authService.login(user);
    }
}
