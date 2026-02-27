import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { initFleetListeners } from '../store/useFleetStore';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubFleet: (() => void) | undefined;
        let verificationInterval: NodeJS.Timeout | undefined;

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            if (currentUser) {
                if (currentUser.emailVerified) {
                    if (!unsubFleet) unsubFleet = initFleetListeners();
                    if (verificationInterval) clearInterval(verificationInterval);
                } else {
                    // Poll for verification
                    verificationInterval = setInterval(async () => {
                        await currentUser.reload();
                        if (auth.currentUser?.emailVerified) {
                            setUser({ ...auth.currentUser } as User); // force re-render
                            if (!unsubFleet) unsubFleet = initFleetListeners();
                            clearInterval(verificationInterval);
                        }
                    }, 3000);
                }
            } else {
                if (unsubFleet) {
                    unsubFleet();
                    unsubFleet = undefined;
                }
                if (verificationInterval) clearInterval(verificationInterval);
            }
        });
        return () => {
            unsubscribe();
            if (unsubFleet) unsubFleet();
            if (verificationInterval) clearInterval(verificationInterval);
        };
    }, []);

    const logout = async () => {
        await firebaseSignOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
