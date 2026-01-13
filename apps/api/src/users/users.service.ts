import { Injectable, NotFoundException } from '@nestjs/common';
import { UserStatus } from '@prisma/client';
import { createPaginatedResponse } from '../common/pagination/pagination.util';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) { }

    async findAll(page: number = 1, limit: number = 10) {
        const [users, total] = await this.usersRepository.findAll((page - 1) * limit, limit);
        return createPaginatedResponse(users, total, page, limit);
    }

    async updateStatus(id: string, status: UserStatus) {
        const user = await this.usersRepository.findById(id);
        if (!user) throw new NotFoundException('User not found');

        // Logic using Rich Domain Model
        if (status === UserStatus.ACTIVE) {
            user.approve();
        } else {
            // Fallback for other status updates (e.g. banning) - direct assignment for now as pragmatism
            user.status = status;
        }

        const updated = await this.usersRepository.save(user);

        // Return simple object (DTO-like) or the entity directly
        return {
            id: updated.id,
            email: updated.email,
            status: updated.status
        };
    }
}
