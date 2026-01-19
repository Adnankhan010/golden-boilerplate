import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Notes from './Notes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock dependencies
vi.mock('@/lib/api', () => ({
    api: {
        get: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
    },
}));

// Mock AuthContext
const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'USER',
    status: 'ACTIVE',
};

vi.mock('@/context/AuthContext', () => ({
    useAuth: () => ({
        user: mockUser,
        logout: vi.fn(),
    }),
}));

// Setup QueryClient
const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

describe('Notes Page', () => {
    it('renders successfully and shows create button', async () => {
        const queryClient = createTestQueryClient();

        render(
            <QueryClientProvider client={queryClient}>
                <Notes />
            </QueryClientProvider>
        );

        // Smoke Test: Check title
        expect(screen.getByText('My Notes')).toBeDefined(); // Using toBeDefined instead of toBeInTheDocument if jest-dom not setup

        // Smoke Test: Check Create Button
        expect(screen.getByText('Create Note')).toBeDefined();
    });
});
