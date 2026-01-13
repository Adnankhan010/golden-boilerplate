import { useEffect, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { api } from '../lib/api';

export default function VerifyEmail() {
    const navigate = useNavigate();
    const search = useSearch({ from: '/verify' });
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            try {
                if (!search.token) {
                    setStatus('error');
                    setMessage('No verification token provided.');
                    return;
                }

                await api.get(`/auth/verify?token=${search.token}`);
                setStatus('success');
            } catch (err: any) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Verification failed.');
            }
        };

        verify();
    }, [search]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <div className="max-w-md w-full p-8 bg-card rounded-lg shadow-lg border border-border text-center">
                {status === 'verifying' && (
                    <>
                        <h2 className="text-2xl font-bold mb-4">Verifying Email...</h2>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <h2 className="text-2xl font-bold text-green-600 mb-4">Email Verified!</h2>
                        <p className="text-muted-foreground mb-6">
                            Your account has been verified and is now pending administrator approval.
                        </p>
                        <button
                            onClick={() => navigate({ to: '/login' })}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
                        >
                            Go to Login
                        </button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <h2 className="text-2xl font-bold text-destructive mb-4">Verification Failed</h2>
                        <p className="text-muted-foreground mb-6">{message}</p>
                        <button
                            onClick={() => navigate({ to: '/login' })}
                            className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:opacity-90"
                        >
                            Back to Login
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
