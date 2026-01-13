import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaClient, UserStatus } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';

// Mock Prisma for simplicity in this file, normally injected via PrismaModule
const prisma = new PrismaClient();

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private mailService: MailService
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await prisma.user.findUnique({ where: { email } });

        // In real app: await bcrypt.compare(pass, user.password)
        if (user && user.password === pass) {

            // DOUBLE LOCK CHECK
            if (user.status === UserStatus.UNVERIFIED) {
                throw new ForbiddenException('Email not verified. Please check your inbox.');
            }
            if (user.status !== UserStatus.ACTIVE) {
                throw new ForbiddenException('Account pending approval or disabled.');
            }

            const { ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            sub: user.id,
            email: user.email,
            role: user.role,
        };
    }

    async register(data: any) {
        // Create user with UNVERIFIED status
        const user = await prisma.user.create({
            data: {
                ...data,
                status: UserStatus.UNVERIFIED,
            }
        });

        // Generate verification token (valid for 24h)
        const verificationToken = this.jwtService.sign(
            { sub: user.id, type: 'email-verification' },
            { expiresIn: '24h' }
        );

        // Send email
        await this.mailService.sendVerificationEmail(user.email, verificationToken);

        return user;
    }

    async verifyEmail(token: string) {
        try {
            const payload = await this.jwtService.verifyAsync(token);
            if (payload.type !== 'email-verification') {
                throw new BadRequestException('Invalid token type');
            }

            const user = await prisma.user.findUnique({ where: { id: payload.sub } });
            if (!user) throw new BadRequestException('User not found');

            if (user.status !== UserStatus.UNVERIFIED) {
                return { message: 'Email already verified or account active.' };
            }

            // Update to PENDING (Double Lock: still needs Admin approval)
            await prisma.user.update({
                where: { id: user.id },
                data: { status: UserStatus.PENDING },
            });

            return { message: 'Email verified successfully. Account is now PENDING admin approval.' };

        } catch {
            throw new BadRequestException('Invalid or expired verification token.');
        }
    }
}
