import { Injectable } from '@nestjs/common';
import { PrismaClient, User as PrismaUser } from '@prisma/client';
import { User } from '../entities/user.entity';

// Ideally injected via PrismaService, using client directly for now as per current project structure
const prisma = new PrismaClient();

@Injectable()
export class UsersRepository {

    async findById(id: string): Promise<User | null> {
        const raw = await prisma.user.findUnique({ where: { id } });
        if (!raw) return null;
        return this.mapToDomain(raw);
    }

    async findByEmail(email: string): Promise<User | null> {
        const raw = await prisma.user.findUnique({ where: { email } });
        if (!raw) return null;
        return this.mapToDomain(raw);
    }

    async findAll(skip: number, take: number): Promise<[User[], number]> {
        const [rawUsers, total] = await Promise.all([
            prisma.user.findMany({
                skip,
                take,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.user.count(),
        ]);

        return [rawUsers.map(this.mapToDomain), total];
    }

    async save(user: User): Promise<User> {
        // Upsert or Update logic. 
        // For simplicity in this pragmatism, we assume if it exists we update.
        // But since we use simple CRUD often, we might split create/update or use upsert.
        // Let's use update for now as expected by current flows (approve).

        const raw = await prisma.user.update({
            where: { id: user.id },
            data: {
                status: user.status,
                // Add other mutable fields if needed
            }
        });

        return this.mapToDomain(raw);
    }

    // Creating a fresh user
    async create(data: {
        email: string;
        name?: string | null;
        password?: string;
        role?: any;
        status?: any;
        provider?: string;
        providerId?: string;
    }): Promise<User> {
        const raw = await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: data.password || '', // Prisma might require string if not nullable in DB, but we made pass required in schema? Wait.
                role: data.role,
                status: data.status,
                provider: data.provider,
                providerId: data.providerId
            }
        });
        return this.mapToDomain(raw);
    }

    private mapToDomain(raw: PrismaUser): User {
        return User.restore({
            id: raw.id,
            email: raw.email,
            name: raw.name,
            role: raw.role,
            status: raw.status,
            createdAt: raw.createdAt,
            password: raw.password
        });
    }
}
