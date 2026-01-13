import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './repositories/users.repository';
import { User } from './entities/user.entity';
import { Role, UserStatus } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

// Mock User Entity
const mockUser = new User(
    '1',
    'test@example.com',
    'Test',
    Role.USER,
    UserStatus.PENDING,
    new Date()
);

// Mock UsersRepository
const mockUsersRepository = {
    findById: jest.fn(),
    save: jest.fn(),
    findAll: jest.fn(),
};

describe('UsersService', () => {
    let service: UsersService;
    let repository: typeof mockUsersRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: UsersRepository, useValue: mockUsersRepository },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        repository = module.get(UsersRepository);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('updateStatus', () => {
        it('should approve a user', async () => {
            repository.findById.mockResolvedValue(mockUser);
            // Mock save to return the updated user
            repository.save.mockImplementation(async (u: User) => u);

            const result = await service.updateStatus('1', UserStatus.ACTIVE);

            expect(repository.findById).toHaveBeenCalledWith('1');
            expect(result.status).toBe(UserStatus.ACTIVE);
            expect(repository.save).toHaveBeenCalled();
        });

        it('should throw NotFoundException if user does not exist', async () => {
            repository.findById.mockResolvedValue(null);

            await expect(service.updateStatus('999', UserStatus.ACTIVE))
                .rejects.toThrow(NotFoundException);
        });
    });

    describe('findAll', () => {
        it('should return paginated response', async () => {
            repository.findAll.mockResolvedValue([[mockUser], 1]);

            const result = await service.findAll(1, 10);

            expect(repository.findAll).toHaveBeenCalledWith(0, 10);
            expect(result.data).toHaveLength(1);
            expect(result.meta.total).toBe(1);
        });
    });
});
