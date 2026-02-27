import { Navigate, Outlet } from 'react-router-dom';
import { isValidToken } from '../constants/auth';

export function ProtectedRoute() {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');

    if (!token || !userString || !isValidToken(token)) {
        if (token || userString) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
