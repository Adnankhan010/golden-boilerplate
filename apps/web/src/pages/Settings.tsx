import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function Settings() {
    const { user } = useAuth();
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors, isSubmitting: isProfileSubmitting } } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || '',
        }
    });

    const { register: registerPass, handleSubmit: handlePassSubmit, reset: resetPass, formState: { errors: passErrors, isSubmitting: isPassSubmitting } } = useForm({
        resolver: zodResolver(passwordSchema),
    });

    const onUpdateProfile = async (data: z.infer<typeof profileSchema>) => {
        try {
            setMessage(null);
            await api.patch('/users/profile', data);
            setMessage({ type: 'success', text: 'Profile updated successfully.' });
            // Ideally assume AuthContext updates user or we force reload
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        }
    };

    const onUpdatePassword = async (data: z.infer<typeof passwordSchema>) => {
        try {
            setMessage(null);
            await api.patch('/users/password', {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword
            });
            setMessage({ type: 'success', text: 'Password updated successfully.' });
            resetPass();
        } catch (error: any) {
            const errMsg = error.response?.data?.message || 'Failed to update password.';
            setMessage({ type: 'error', text: errMsg });
        }
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">Manage your account settings and preferences.</p>
                </div>

                {message && (
                    <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid gap-8">
                    {/* Profile Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile</CardTitle>
                            <CardDescription>Update your public display name.</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleProfileSubmit(onUpdateProfile)}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" {...registerProfile('name')} placeholder="Your Name" />
                                    {profileErrors.name && <p className="text-sm text-destructive">{profileErrors.name.message as string}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input value={user?.email} disabled className="bg-muted text-muted-foreground" />
                                    <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={isProfileSubmitting}>
                                    {isProfileSubmitting ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>

                    {/* Password Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Update your password.</CardDescription>
                        </CardHeader>
                        <form onSubmit={handlePassSubmit(onUpdatePassword)}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <Input id="currentPassword" type="password" {...registerPass('currentPassword')} />
                                    {passErrors.currentPassword && <p className="text-sm text-destructive">{passErrors.currentPassword.message as string}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input id="newPassword" type="password" {...registerPass('newPassword')} />
                                    {passErrors.newPassword && <p className="text-sm text-destructive">{passErrors.newPassword.message as string}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input id="confirmPassword" type="password" {...registerPass('confirmPassword')} />
                                    {passErrors.confirmPassword && <p className="text-sm text-destructive">{passErrors.confirmPassword.message as string}</p>}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" variant="destructive" disabled={isPassSubmitting}>
                                    {isPassSubmitting ? 'Updating...' : 'Update Password'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
}
