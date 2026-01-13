import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
}

export function AdminUserList() {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await api.get('/users');
            return response.data.data as User[];
        },
    });

    const approveMutation = useMutation({
        mutationFn: async (userId: string) => {
            await api.patch(`/users/${userId}/status`, { status: 'ACTIVE' });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            alert('User approved!');
        },
        onError: () => {
            alert('Failed to approve user.');
        }
    });

    if (isLoading) return <div>Loading users...</div>;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
            case 'PENDING':
                return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
            case 'UNVERIFIED':
                return <Badge variant="outline" className="text-muted-foreground">Unverified</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="bg-card border border-border rounded-lg shadow-sm">
            <div className="p-6 border-b border-border">
                <h3 className="text-xl font-semibold text-foreground">Pending Approvals</h3>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{getStatusBadge(user.status)}</TableCell>
                            <TableCell>
                                {user.status === 'PENDING' && (
                                    <Button
                                        size="sm"
                                        onClick={() => approveMutation.mutate(user.id)}
                                        disabled={approveMutation.isPending}
                                    >
                                        {approveMutation.isPending ? 'Approvng...' : 'Approve'}
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
