import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { UserStatus } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { UsersRepository } from '../users/repositories/users.repository';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private mailService: MailService,
        private usersRepository: UsersRepository
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersRepository.findByEmail(email);

        // In real app: await bcrypt.compare(pass, user.password)
        if (user && user.password === pass) {
            this.checkDoubleLock(user);
            // Return simple object for JWT
            return {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
                status: user.status
            };
        }
        return null;
    }

    async validateSocialUser(email: string, name: string, provider: string, providerId: string): Promise<any> {
        let user = await this.usersRepository.findByEmail(email);

        if (!user) {
            // Create user from Social Login
            // Status: PENDING (Double Lock) - OR UNVERIFIED?
            // Usually Social Login implies Email Verification, so we can skip to PENDING.
            user = await this.usersRepository.create({
                email,
                name,
                password: '', // No password for social
                status: UserStatus.PENDING,
                role: 'USER', // Default
                provider,
                providerId
            });
        } else {
            // Update provider info if missing (Account Linking)
            // For now, just logging in.
            // Check Double Lock
            this.checkDoubleLock(user);
        }

        return user;
    }

    private checkDoubleLock(user: any) {
        if (user.status === UserStatus.UNVERIFIED) {
            throw new ForbiddenException('Email not verified. Please check your inbox.');
        }
        if (user.status !== UserStatus.ACTIVE && user.status !== UserStatus.PENDING) {
            // Allowing PENDING for now? No, usually login requires ACTIVE.
            // But for Social Login registration, we return the user.
            // Let's enforce Strict Double Lock for Login.
        }
        // Actually, validateUser returns the user object to the controller/strategy.
        // It's up to the Guard or Controller to block access if not ACTIVE.
        // But logic here says "Account pending approval".
        if (user.status !== UserStatus.ACTIVE && user.status !== UserStatus.PENDING) {
            // We allow PENDING to login?
            // No, standard Double Lock: Register -> Verify -> PENDING -> Admin Approve -> ACTIVE.
            // Only ACTIVE can get a token.
            // But wait, if I register, I get a user object back?
        }

        if (user.status !== UserStatus.ACTIVE) {
            // Identify if it's social registration flow or login flow? 
            // We'll throw if strict.
            // For now, let's allow PENDING users to 'login' but maybe with limited scope?
            // Or stick to the original logic: "Account pending approval or disabled."
            throw new ForbiddenException('Account pending approval or disabled.');
        }
    }

    async login(user: any) {
        // If user is PENDING, we might want to return a specific message instead of a token?
        // Or we allow token but it has no permissions.
        // Let's stick to original: only ACTIVE users get tokens.
        // BUT: validateSocialUser creates a PENDING user. 
        // We should allow the initial return so we can send a response "Waiting for approval".

        // Re-read validateUser logic: it throws if not ACTIVE.
        // So login won't be called if validateUser throws.

        // For Social, we might want to handle it inside the Strategy Callback controller.

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
        const user = await this.usersRepository.create({
            ...data,
            status: UserStatus.UNVERIFIED,
            provider: 'LOCAL'
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

            const user = await this.usersRepository.findById(payload.sub);
            if (!user) throw new BadRequestException('User not found');

            // Use Rich Domain Model
            user.verifyEmail();
            await this.usersRepository.save(user);

            return { message: 'Email verified successfully. Account is now PENDING admin approval.' };

        } catch {
            throw new BadRequestException('Invalid or expired verification token.');
        }
    }
}
