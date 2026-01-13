
import { AdminUserList } from '../components/AdminUserList';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboard() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 container py-8">
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>System Administration</CardTitle>
                            <CardDescription>Manage users and system settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-4 bg-muted/50 rounded-lg">
                                <p className="text-sm font-medium">Original Admin: {user?.email}</p>
                            </div>

                            <AdminUserList />
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
