import { Link } from '@tanstack/react-router';
import { LayoutDashboard, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

export function AdminSidebar({ className }: SidebarProps) {
    // Removed useAuth/logout as it is now in Header UserNav

    const items = [
        {
            title: "General",
            items: [
                {
                    title: "Dashboard",
                    href: "/admin",
                    icon: LayoutDashboard,
                },
                {
                    title: "Users",
                    href: "/admin/users",
                    icon: Users,
                },
            ]
        },
    ];

    return (
        <div className={cn("relative hidden md:block w-72 h-screen sticky top-0 border-r", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="space-y-1">
                        <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
                            Overview
                        </h2>
                        <div className="space-y-1">
                            {items[0].items.map((item) => (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className="block"
                                    activeProps={{ className: "bg-secondary/50 text-accent-foreground" }}
                                >
                                    {({ isActive }) => (
                                        <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                                            <item.icon className="mr-2 h-4 w-4" />
                                            {item.title}
                                        </Button>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
