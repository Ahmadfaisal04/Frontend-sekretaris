'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { authService } from '@/services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in on mount
        const token = Cookies.get('authToken');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const result = await authService.login(username, password);
            
            if (result.success) {
                // Set cookie for authentication (expires in 1 day)
                Cookies.set('authToken', result.data.token, { expires: 1 });
                
                // Save user data
                const userData = {
                    name: result.data.name || 'Admin Sekretaris',
                    username: username,
                    role: result.data.role || 'sekretaris',
                };
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                
                router.push('/dashboard');
                return { success: true };
            }
            
            return { 
                success: false, 
                error: result.error || 'NIK atau password tidak valid' 
            };
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                error: 'Terjadi kesalahan saat login. Silakan coba lagi.' 
            };
        }
    };

    const logout = () => {
        Cookies.remove('authToken');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/authentication/sign-in');
    };

    const value = {
        user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 