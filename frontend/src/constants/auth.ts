export interface User {
    email: string;
    name?: string;
}



export const isValidToken = (token: string | null): boolean => {
    return !!token;
};
