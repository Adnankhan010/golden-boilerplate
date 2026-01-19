import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import {
    RouterProvider,
    createRouter,
    createRootRoute,
    createRoute,
    Outlet,
    redirect
} from '@tanstack/react-router'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import Dashboard from './pages/Dashboard'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import LandingPage from './pages/LandingPage'
import Notes from './pages/Notes'
import Settings from './pages/Settings'
import AdminLayout from './layouts/AdminLayout'
import { AdminUserList } from './components/AdminUserList'

const queryClient = new QueryClient()

const rootRoute = createRootRoute({
    component: () => (
        <AuthProvider>
            <div className="min-h-screen bg-background text-foreground">
                <Outlet />
            </div>
        </AuthProvider>
    ),
})

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: LandingPage,
})

const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: Login,
})

const registerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/register',
    component: Register,
})

const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/dashboard',
    component: Dashboard,
    beforeLoad: () => {
        if (!localStorage.getItem('token')) {
            throw redirect({
                to: '/login',
            })
        }
    }
})

const notesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/notes',
    component: Notes,
    beforeLoad: () => {
        if (!localStorage.getItem('token')) {
            throw redirect({
                to: '/login',
            })
        }
    }
})

const settingsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/settings',
    component: Settings,
    beforeLoad: () => {
        if (!localStorage.getItem('token')) {
            throw redirect({
                to: '/login',
            })
        }
    }
})

const verifyRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/verify',
    component: VerifyEmail,
    validateSearch: (search: Record<string, unknown>) => {
        return {
            token: search.token as string,
        }
    },
})

// --- Admin Routes ---

const adminLoginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/admin/login',
    component: AdminLogin,
})

const adminRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/admin',
    component: AdminLayout,
    beforeLoad: () => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (!token || !userStr) {
            throw redirect({ to: '/admin/login' })
        }

        const user = JSON.parse(userStr);
        if (user.role !== 'ADMIN') {
            throw redirect({ to: '/admin/login' })
        }
    }
})

const adminDashboardRoute = createRoute({
    getParentRoute: () => adminRoute,
    path: '/',
    component: AdminDashboard,
})

const adminUsersRoute = createRoute({
    getParentRoute: () => adminRoute,
    path: '/users',
    component: AdminUserList,
})

const routeTree = rootRoute.addChildren([
    indexRoute,
    loginRoute,
    registerRoute,
    verifyRoute,
    dashboardRoute,
    notesRoute,
    settingsRoute,
    adminLoginRoute,
    adminRoute.addChildren([
        adminDashboardRoute,
        adminUsersRoute
    ])
])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    )
}

export default App
