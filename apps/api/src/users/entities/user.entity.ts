import { UserStatus, Role } from '@prisma/client';

export class User {
    constructor(
        public readonly id: string,
        public readonly email: string,
        public readonly name: string | null,
        public readonly role: Role,
        public status: UserStatus,
        public readonly createdAt: Date,
        public readonly password?: string,
        public readonly provider: string | null = 'LOCAL',
        public readonly providerId: string | null = null,
    ) { }

    // Business Logic Methods

    /**
     * Approves a user, changing status to ACTIVE.
     * Can only be done if user is currently PENDING.
     */
    approve(): void {
        this.status = UserStatus.ACTIVE;
    }

    /**
     * Marks user as Verified (Email verified), transitions to PENDING (waiting for admin).
     * This follows the 'Double Lock' logic.
     */
    verifyEmail(): void {
        if (this.status === UserStatus.UNVERIFIED) {
            this.status = UserStatus.PENDING;
        }
    }

    // Factory method to reconstitute from Persistence (Prisma)
    static restore(data: {
        id: string;
        email: string;
        name: string | null;
        role: Role;
        status: UserStatus;
        createdAt: Date;
        password?: string;
        provider?: string | null;
        providerId?: string | null;
    }): User {
        return new User(
            data.id,
            data.email,
            data.name,
            data.role,
            data.status,
            data.createdAt,
            data.password,
            data.provider,
            data.providerId
        );
    }
}
