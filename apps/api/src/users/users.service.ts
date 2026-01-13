import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, UserStatus } from '@prisma/client';
import { createPaginatedResponse } from '../common/pagination/pagination.util';

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
    async findAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    status: true,
                    createdAt: true,
                }
            }),
            prisma.user.count(),
        ]);

        return createPaginatedResponse(users, total, page, limit);
    }

    async updateStatus(id: string, status: UserStatus) {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException('User not found');

        return prisma.user.update({
            where: { id },
            data: { status },
            select: { id: true, email: true, status: true },
        });
    }
}
