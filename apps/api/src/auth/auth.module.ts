import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PoliciesGuard } from '../casl/policies.guard';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        MailModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET || 'secretKey', // In production use env vars
            signOptions: { expiresIn: '60s' },
        }),
    ],
    providers: [AuthService, PoliciesGuard, GoogleStrategy, FacebookStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule { }
