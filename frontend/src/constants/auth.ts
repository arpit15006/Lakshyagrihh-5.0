export type UserRole = 'admin' | 'manager' | 'dispatcher' | 'safety_officer';

export interface User {
    email: string;
    role: UserRole;
    name?: string;
}

export const MOCK_USERS = [
    { email: "admin@gmail.com", password: "admin123", role: "admin" as UserRole },
    { email: "manager@gmail.com", password: "manager123", role: "manager" as UserRole },
    { email: "dispatcher@gmail.com", password: "dispatcher123", role: "dispatcher" as UserRole },
    { email: "safety@gmail.com", password: "safety123", role: "safety_officer" as UserRole }
];

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
    admin: ['/dashboard', '/vehicles', '/trips', '/maintenance', '/expenses', '/drivers', '/analytics'],
    manager: ['/dashboard', '/vehicles', '/trips', '/maintenance', '/expenses', '/drivers', '/analytics'],
    dispatcher: ['/dashboard', '/trips', '/drivers', '/analytics'],
    safety_officer: ['/dashboard', '/vehicles', '/trips', '/maintenance', '/drivers'],
};

export const hasPermission = (role: UserRole, path: string): boolean => {
    return ROLE_PERMISSIONS[role]?.includes(path) || false;
};

export const isValidToken = (token: string | null): boolean => {
    if (!token) return false;
    try {
        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) return false;

        // Make base64 url-safe decoding work
        const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        const decoded = JSON.parse(jsonPayload);

        // Check if token has expired
        if (decoded.exp && (decoded.exp * 1000) < Date.now()) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
};
