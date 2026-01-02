import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCustomer } from '../lib/shopify';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    orders: any;
}

interface AuthContextType {
    user: User | null;
    login: (accessToken: string, expiresAt: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async (accessToken: string) => {
        try {
            const customer = await getCustomer(accessToken);
            if (customer) {
                setUser(customer);
            } else {
                // Token invalid or user not found
                logout();
            }
        } catch (error) {
            console.error("Failed to fetch user", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const accessToken = localStorage.getItem('shopifyCustomerAccessToken');
        const expiresAt = localStorage.getItem('shopifyCustomerAccessTokenExpiresAt');

        if (accessToken && expiresAt) {
            if (new Date(expiresAt) > new Date()) {
                fetchUser(accessToken);
            } else {
                logout(); // Token expired
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (accessToken: string, expiresAt: string) => {
        localStorage.setItem('shopifyCustomerAccessToken', accessToken);
        localStorage.setItem('shopifyCustomerAccessTokenExpiresAt', expiresAt);
        await fetchUser(accessToken);
    };

    const logout = () => {
        localStorage.removeItem('shopifyCustomerAccessToken');
        localStorage.removeItem('shopifyCustomerAccessTokenExpiresAt');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
