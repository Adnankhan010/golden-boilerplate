import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate({ to: '/' });
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <Link to="/" className="mr-6 flex items-center space-x-2">
                    <span className="font-bold text-xl inline-block">Golden Stack</span>
                </Link>
                <nav className="flex items-center space-x-6 text-sm font-medium">
                    <Link to="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        Home
                    </Link>
                    {user && (
                        <Link to="/notes" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Notes
                        </Link>
                    )}
                </nav>
                <div className="ml-auto flex items-center space-x-4">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="/avatars/01.png" alt={user.email} />
                                        <AvatarFallback>{user.email.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">User</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate({ to: '/dashboard' })}>
                                    Dashboard
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate({ to: '/notes' })}>
                                    My Notes
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate({ to: '/settings' })}>
                                    Settings
                                </DropdownMenuItem>
                                {user.role === 'ADMIN' && (
                                    <DropdownMenuItem onClick={() => navigate({ to: '/admin' })}>
                                        Admin Panel
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Link to="/login">
                                <Button variant="ghost">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button>Get Started</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header >
    );
}
