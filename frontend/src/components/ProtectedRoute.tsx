import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { UserRole } from '../constants/auth';
import { hasPermission, isValidToken } from '../constants/auth';

interface ProtectedRouteProps {
    allowedRoles?: UserRole[];
}

export function ProtectedRoute(_props: ProtectedRouteProps) {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const location = useLocation();

    if (!token || !userString || !isValidToken(token)) {
        if (token || userString) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        return <Navigate to="/" replace />;
    }

    const user = JSON.parse(userString);
    const role = user.role as UserRole;

    // Check if path is allowed for this role
    if (!hasPermission(role, location.pathname)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
