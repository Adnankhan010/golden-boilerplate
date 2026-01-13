import { User } from './user.entity';
import { Role, UserStatus } from '@prisma/client';

describe('User Entity', () => {
    let user: User;
    const now = new Date();

    beforeEach(() => {
        // Create a basic UNVERIFIED user for testing
        user = new User(
            '1',
            'test@example.com',
            'Test User',
            Role.USER,
            UserStatus.UNVERIFIED,
            now
        );
    });

    it('should be created with correct values', () => {
        expect(user.id).toBe('1');
        expect(user.status).toBe(UserStatus.UNVERIFIED);
    });

    describe('verifyEmail', () => {
        it('should transition from UNVERIFIED to PENDING', () => {
            user.verifyEmail();
            expect(user.status).toBe(UserStatus.PENDING);
        });

        it('should not change status if not UNVERIFIED', () => {
            const activeUser = new User('2', 'a@b.com', 'A', Role.USER, UserStatus.ACTIVE, now);
            activeUser.verifyEmail();
            expect(activeUser.status).toBe(UserStatus.ACTIVE);
        });
    });

    describe('approve', () => {
        it('should transition to ACTIVE', () => {
            // Usually approval happens from PENDING, but method logic just sets to ACTIVE
            user.approve();
            expect(user.status).toBe(UserStatus.ACTIVE);
        });
    });
});
